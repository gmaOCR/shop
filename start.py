import subprocess
import os
import time
import requests
from requests.exceptions import ConnectionError, Timeout, HTTPError
import signal
import psutil

def find_process_on_port(port):
    """Trouver le PID d'un processus écoutant sur le port donné."""
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            for conn in proc.net_connections(kind='inet'):
                if conn.laddr.port == port:
                    return proc.pid
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return None

def kill_process(pid):
    """Tuer un processus donné son PID."""
    if pid:
        print(f"Arrêt du processus avec le PID {pid}...")
        try:
            os.kill(pid, signal.SIGTERM)
            print(f"Processus avec le PID {pid} arrêté.")
        except ProcessLookupError:
            print(f"Processus avec le PID {pid} non trouvé.")
        except PermissionError:
            print(f"Permission refusée pour arrêter le processus avec le PID {pid}.")
        except Exception as e:
            print(f"Erreur lors de l'arrêt du processus avec le PID {pid}: {e}")

def start_django():
    print("Démarrage du serveur Django...")
    process = subprocess.Popen(
        ["python", "manage.py", "runserver"],
        cwd=os.path.join(os.path.dirname(__file__), "backend"),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    return process

def start_vite():
    print("Démarrage du serveur Vite...")
    process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=os.path.abspath(os.path.join(os.path.dirname(__file__), "frontend")),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return process

def check_django():
    print("Vérification du serveur Django...")
    timeout_seconds = 2
    start_time = time.time()
    
    while time.time() - start_time < timeout_seconds:
        try:
            response = requests.get("http://127.0.0.1:8000/api/hello/", timeout=1)
            if response.status_code == 200:
                print("Serveur Django opérationnel.")
                return True
            else:
                print("Serveur Django non prêt, code réponse:", response.status_code)
        except (ConnectionError, Timeout) as e:
            print("Erreur de connexion à Django ou timeout:", e)
        time.sleep(5)

    print("Le serveur Django n'a pas démarré dans le temps imparti.")
    return False

def check_vite():
    print("Vérification du serveur Vite...")
    timeout_seconds = 10
    start_time = time.time()
    
    while time.time() - start_time < timeout_seconds:
        try:
            # Tester la route principale du serveur Vite
            response = requests.get("http://localhost:5173/", timeout=2)
            # print("Statut de la réponse:", response.status_code)
            # print("Contenu de la réponse:", response.text[:200])  
            
            if response.status_code == 200 and '<!doctype html>' in response.text:
                print("Serveur Vite opérationnel.")
                return True
            else:
                print("Serveur Vite non prêt, code réponse:", response.status_code)
        except (ConnectionError, Timeout) as e:
            print("Erreur de connexion à Vite ou timeout:", e)
        except HTTPError as e:
            print("Erreur HTTP:", e)
        except Exception as e:
            print("Erreur inattendue:", e)
        
        time.sleep(5)


def stop_servers(django_process, vite_process):
    print("Arrêt des serveurs...")
    django_process.terminate()
    vite_process.terminate()
    django_process.wait()
    vite_process.wait()
    print("Serveurs arrêtés.")

if __name__ == "__main__":
    print("Démarrage des serveurs...")

    django_process = start_django()
    time.sleep(2)  # Délai pour permettre à Django de démarrer
    vite_process = start_vite()

    time.sleep(5)  # Délai supplémentaire pour permettre à Vite de démarrer

    if check_django() and check_vite():
        print("Les serveurs Django et Vite sont maintenant opérationnels.")
    else:
        print("Un ou les deux serveurs ne sont pas opérationnels.")

    input("Appuyez sur Entrée pour quitter...")
    stop_servers(django_process, vite_process)