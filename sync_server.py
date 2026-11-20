"""Máy chủ cho một người: mở trang web và đồng bộ dữ liệu trong mạng nhà."""
import json
from datetime import datetime, timezone
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import socket
import sys

def app_folder():
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent

ROOT = app_folder()
DATA = ROOT / "sync-data.json"
PORT = 8000

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def empty_store():
    return {"tasks": [], "moods": {}, "habits": [], "settings": {}, "deletedTasks": {}, "deletedHabits": {}, "atelier": None}

def load_store():
    if not DATA.exists():
        return empty_store()
    try:
        data = json.loads(DATA.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return empty_store()
    base = empty_store()
    base.update({k: data.get(k, base[k]) for k in base})
    return base

def save_store(data):
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

def newer(a, b):
    return str(a or "") >= str(b or "")

def merge(current, incoming):
    current = current or empty_store()
    incoming = incoming or {}
    deleted_tasks = dict(current.get("deletedTasks") or {})
    deleted_habits = dict(current.get("deletedHabits") or {})
    for key, value in (incoming.get("deletedTasks") or {}).items():
        if newer(value, deleted_tasks.get(key)):
            deleted_tasks[key] = value
    for key, value in (incoming.get("deletedHabits") or {}).items():
        if newer(value, deleted_habits.get(key)):
            deleted_habits[key] = value

    tasks = {task.get("id"): task for task in current.get("tasks") or [] if task.get("id")}
    for task in incoming.get("tasks") or []:
        if not task.get("id"):
            continue
        old = tasks.get(task["id"])
        if not old or newer(task.get("updatedAt"), old.get("updatedAt")):
            tasks[task["id"]] = task
    task_list = []
    for task_id, task in tasks.items():
        if newer(deleted_tasks.get(task_id), task.get("updatedAt")):
            continue
        task_list.append(task)

    moods = dict(current.get("moods") or {})
    for day, entry in (incoming.get("moods") or {}).items():
        old = moods.get(day)
        if not old or newer((entry or {}).get("updatedAt"), (old or {}).get("updatedAt")):
            moods[day] = entry

    habits = {habit.get("id"): habit for habit in current.get("habits") or [] if habit.get("id")}
    for habit in incoming.get("habits") or []:
        if not habit.get("id"):
            continue
        old = habits.get(habit["id"])
        if not old:
            habits[habit["id"]] = habit
            continue
        if newer(habit.get("updatedAt"), old.get("updatedAt")):
            habits[habit["id"]] = habit
    habit_list = []
    for habit_id, habit in habits.items():
        if newer(deleted_habits.get(habit_id), habit.get("updatedAt")):
            continue
        habit_list.append(habit)

    settings = dict(current.get("settings") or {})
    incoming_settings = incoming.get("settings") or {}
    if newer(incoming_settings.get("updatedAt"), settings.get("updatedAt")):
        settings = incoming_settings

    atelier = current.get("atelier")
    incoming_atelier = incoming.get("atelier")
    if incoming_atelier and (not atelier or newer(incoming_atelier.get("updatedAt"), (atelier or {}).get("updatedAt"))):
        atelier = incoming_atelier

    return {
        "tasks": task_list,
        "moods": moods,
        "habits": habit_list,
        "settings": settings,
        "deletedTasks": deleted_tasks,
        "deletedHabits": deleted_habits,
        "atelier": atelier,
        "syncedAt": now_iso(),
    }

def lan_ips():
    ips = set()
    try:
        hostname = socket.gethostname()
        for item in socket.getaddrinfo(hostname, None, socket.AF_INET):
            ip = item[4][0]
            if not ip.startswith("127."):
                ips.add(ip)
    except OSError:
        pass
    try:
        probe = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        probe.connect(("8.8.8.8", 80))
        ips.add(probe.getsockname()[0])
        probe.close()
    except OSError:
        pass
    return sorted(ips)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/api/sync":
            self.send_json(load_store())
            return
        if path == "/api/info":
            self.send_json({"ips": lan_ips(), "port": PORT})
            return
        super().do_GET()

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        if path != "/api/sync":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            incoming = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self.send_error(400, "JSON không hợp lệ")
            return
        merged = merge(load_store(), incoming)
        save_store(merged)
        self.send_json(merged)

    def send_json(self, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

if __name__ == "__main__":
    print(f"Deadline Buddy: http://localhost:{PORT}")
    for ip in lan_ips():
        print(f"Điện thoại cùng Wi-Fi: http://{ip}:{PORT}")
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
