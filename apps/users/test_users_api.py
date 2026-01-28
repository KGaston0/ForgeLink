#!/usr/bin/env python3
"""
Script de prueba para la API de usuarios de ForgeLink

Este script demuestra cómo usar la API de usuarios.
Requiere: requests

Instalación: pip install requests
Uso: python test_users_api.py
"""

import requests
import json
from typing import Optional

BASE_URL = "http://localhost:8000/api"


class ForgelinkUsersAPI:
    """Cliente para la API de usuarios de ForgeLink"""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.token: Optional[str] = None

    def _headers(self, auth: bool = True) -> dict:
        """Generar headers para las peticiones"""
        headers = {"Content-Type": "application/json"}
        if auth and self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    def register(self, username: str, email: str, password: str,
                 first_name: str = "", last_name: str = "") -> dict:
        """Registrar un nuevo usuario"""
        url = f"{self.base_url}/users/"
        data = {
            "username": username,
            "email": email,
            "password": password,
            "password_confirm": password,
            "first_name": first_name,
            "last_name": last_name
        }
        response = requests.post(url, json=data, headers=self._headers(auth=False))
        response.raise_for_status()
        return response.json()

    def login(self, username: str, password: str) -> dict:
        """Obtener token de autenticación"""
        url = f"{self.base_url}/auth/jwt/login/"
        data = {"username": username, "password": password}
        response = requests.post(url, json=data, headers=self._headers(auth=False))
        response.raise_for_status()
        result = response.json()
        self.token = result["access"]
        return result

    def get_profile(self) -> dict:
        """Get current user profile"""
        url = f"{self.base_url}/users/me/"
        response = requests.get(url, headers=self._headers())
        response.raise_for_status()
        return response.json()

    def update_profile(self, **data) -> dict:
        """Update current user profile"""
        url = f"{self.base_url}/users/me/"
        response = requests.patch(url, json=data, headers=self._headers())
        response.raise_for_status()
        return response.json()

    def change_password(self, old_password: str, new_password: str) -> dict:
        """Cambiar contraseña"""
        url = f"{self.base_url}/users/change_password/"
        data = {
            "old_password": old_password,
            "new_password": new_password,
            "new_password_confirm": new_password
        }
        response = requests.post(url, json=data, headers=self._headers())
        response.raise_for_status()
        return response.json()

    def list_users(self, **params) -> dict:
        """Listar usuarios (solo admin)"""
        url = f"{self.base_url}/users/"
        response = requests.get(url, params=params, headers=self._headers())
        response.raise_for_status()
        return response.json()

    def get_user(self, user_id: int) -> dict:
        """Obtener usuario específico"""
        url = f"{self.base_url}/users/{user_id}/"
        response = requests.get(url, headers=self._headers())
        response.raise_for_status()
        return response.json()

    def upgrade_membership(self, user_id: int, membership_type: str,
                          start_date: str = None, end_date: str = None) -> dict:
        """Actualizar membresía de un usuario (solo admin)"""
        url = f"{self.base_url}/users/{user_id}/upgrade_membership/"
        data = {"membership_type": membership_type}
        if start_date:
            data["membership_start_date"] = start_date
        if end_date:
            data["membership_end_date"] = end_date
        response = requests.post(url, json=data, headers=self._headers())
        response.raise_for_status()
        return response.json()

    def get_stats(self) -> dict:
        """Obtener estadísticas de usuarios (solo admin)"""
        url = f"{self.base_url}/users/stats/"
        response = requests.get(url, headers=self._headers())
        response.raise_for_status()
        return response.json()


def print_json(data: dict, title: str = ""):
    """Print JSON in readable format"""
    if title:
        print(f"\n{'='*60}")
        print(f"  {title}")
        print('='*60)
    print(json.dumps(data, indent=2, ensure_ascii=False))


def main():
    """Función principal para probar la API"""
    api = ForgelinkUsersAPI()

    print("\n🚀 Probando API de Usuarios de ForgeLink\n")

    # 1. Registrar un usuario
    print("1️⃣  Registrando un nuevo usuario...")
    try:
        user = api.register(
            username="testuser123",
            email="testuser123@example.com",
            password="TestPass123!",
            first_name="Test",
            last_name="User"
        )
        print_json(user, "Usuario registrado exitosamente")
    except requests.exceptions.HTTPError as e:
        print(f"❌ Error al registrar: {e}")
        if e.response.status_code == 400:
            print("   (El usuario probablemente ya existe)")

    # 2. Login
    print("\n2️⃣  Iniciando sesión...")
    try:
        tokens = api.login("testuser123", "TestPass123!")
        print(f"✅ Login exitoso! Token: {tokens['access'][:50]}...")
    except requests.exceptions.HTTPError as e:
        print(f"❌ Error al iniciar sesión: {e}")
        return

    # 3. Obtener perfil
    print("\n3️⃣  Obteniendo perfil del usuario...")
    try:
        profile = api.get_profile()
        print_json(profile, "Perfil del usuario")
    except requests.exceptions.HTTPError as e:
        print(f"❌ Error al obtener perfil: {e}")

    # 4. Actualizar perfil
    print("\n4️⃣  Actualizando perfil...")
    try:
        updated = api.update_profile(
            bio="Desarrollador Python apasionado por Django y REST APIs",
            phone_number="+1234567890"
        )
        print_json({
            "username": updated["username"],
            "bio": updated["bio"],
            "phone_number": updated["phone_number"]
        }, "Perfil actualizado")
    except requests.exceptions.HTTPError as e:
        print(f"❌ Error al actualizar perfil: {e}")

    # 5. Intentar listar usuarios (probablemente falle si no es admin)
    print("\n5️⃣  Intentando listar usuarios (requiere permisos de admin)...")
    try:
        users = api.list_users()
        print_json({"count": users.get("count", len(users))},
                  "Usuarios listados")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            print("⚠️  Acceso denegado (se requiere permisos de admin)")
        else:
            print(f"❌ Error: {e}")

    # 6. Probar con usuario admin (si existe)
    print("\n6️⃣  Probando funciones de admin...")
    print("    Para probar funciones de admin, necesitas:")
    print("    1. Crear un superusuario: python manage.py createsuperuser")
    print("    2. Modificar este script para usar esas credenciales")

    # Ejemplo de cómo usar funciones de admin:
    print("\n📝 Ejemplo de uso con admin:")
    print("""
    # Login como admin
    admin_api = ForgelinkUsersAPI()
    admin_api.login("admin", "admin_password")
    
    # Listar usuarios
    users = admin_api.list_users(membership_type="free")
    
    # Actualizar membresía
    admin_api.upgrade_membership(
        user_id=1, 
        membership_type="premium",
        end_date="2027-01-26T00:00:00Z"
    )
    
    # Ver estadísticas
    stats = admin_api.get_stats()
    """)

    print("\n✅ Pruebas completadas!\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Pruebas interrumpidas por el usuario")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
