"""Cửa sổ Deadline Buddy. Máy chủ đồng bộ chạy cùng tiến trình."""
import socket
import subprocess
import sys
import threading
import time
import winsound
from pathlib import Path

import sync_server
import webview
from winotify import Notification, audio

class DesktopApi:
    def notify(self, title, body):
        toast = Notification(
            app_id="Microsoft.Windows.Explorer",
            title=str(title or "Deadline Buddy"),
            msg=str(body or "").replace("\n", " "),
        )
        toast.set_audio(audio.Default, loop=False)
        toast.show()
        return True

    def ring(self):
        candidates = [
            sync_server.ROOT / "pomo-bell.mp3",
            Path(getattr(sys, "_MEIPASS", sync_server.ROOT)) / "pomo-bell.mp3",
        ]
        path = next((item for item in candidates if item.exists()), None)

        def play():
            if path:
                uri = path.resolve().as_uri()
                script = (
                    "Add-Type -AssemblyName PresentationCore; "
                    "$player = New-Object System.Windows.Media.MediaPlayer; "
                    "$player.Volume = 1; "
                    f"$player.Open([Uri]'{uri}'); "
                    "$player.Play(); "
                    "Start-Sleep -Milliseconds 7000;"
                )
                try:
                    subprocess.run(
                        ["powershell", "-NoProfile", "-WindowStyle", "Hidden", "-Command", script],
                        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000),
                        timeout=12,
                        check=False,
                    )
                    return
                except Exception:
                    pass
            try:
                winsound.MessageBeep(winsound.MB_ICONEXCLAMATION)
            except Exception:
                pass

        threading.Thread(target=play, daemon=True).start()
        return True

def port_open(port):
    probe = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    probe.settimeout(0.4)
    try:
        return probe.connect_ex(("127.0.0.1", port)) == 0
    finally:
        probe.close()

def serve():
    sync_server.ThreadingHTTPServer(("0.0.0.0", sync_server.PORT), sync_server.Handler).serve_forever()

def main():
    if not port_open(sync_server.PORT):
        threading.Thread(target=serve, daemon=True).start()
        for _ in range(40):
            if port_open(sync_server.PORT):
                break
            time.sleep(0.1)
    window = webview.create_window(
        "Deadline Buddy",
        f"http://127.0.0.1:{sync_server.PORT}/?v=28",
        width=1280,
        height=840,
        min_size=(900, 640),
        js_api=DesktopApi(),
    )
    storage = sync_server.ROOT / "webview-data"
    storage.mkdir(exist_ok=True)
    webview.start(private_mode=False, storage_path=str(storage), icon=str(sync_server.ROOT / "DeadlineBuddy.ico"))
    return window

if __name__ == "__main__":
    main()
