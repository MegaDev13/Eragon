"""
Crônica de Aethelgard - Camada de Persistência de Dados (db.py)
Gerencia o salvamento e recuperação de jogadores e inventários em JSON/SQLite com trava anticorrupção.
"""
import json
import os
import threading

DB_FILE = os.path.join(os.path.dirname(__file__), "game_db.json")
_db_lock = threading.Lock()

def _load_db():
    if not os.path.exists(DB_FILE):
        return {"players": {}, "items": {}}
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[DB Error] Falha ao carregar banco JSON ({e}). Inicializando banco limpo na memória.")
        return {"players": {}, "items": {}}

def _save_db(data):
    with _db_lock:
        # Usar arquivo temporário atômico para garantir que o JSON do save nunca seja corrompido em caso de interrupção
        temp_file = DB_FILE + ".tmp"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        os.replace(temp_file, DB_FILE)

def get_player(player_id):
    from main.game.models import Player
    data = _load_db()
    p_data = data.get("players", {}).get(str(player_id))
    if not p_data:
        return None
    return Player.from_dict(p_data)

def save_player(player):
    data = _load_db()
    if "players" not in data:
        data["players"] = {}
    data["players"][str(player.id)] = player.to_dict() if hasattr(player, 'to_dict') else player
    _save_db(data)
    return True

def get_item_template(item_id):
    from main.game.models import Item
    data = _load_db()
    i_data = data.get("items", {}).get(str(item_id))
    if i_data:
        return Item.from_dict(i_data)
    # Catálogo base de itens se não estiver salvo
    catalog = {
        "sword_1": {"item_id": "sword_1", "name": "Espada Longa Feudal", "price": 50, "item_type": "arma", "properties": {"damage": 15}},
        "potion_1": {"item_id": "potion_1", "name": "Poção de Cura", "price": 20, "item_type": "consumivel", "properties": {"heal": 50}},
        "armor_1": {"item_id": "armor_1", "name": "Peitoral Rúnico", "price": 120, "item_type": "armadura", "properties": {"defense": 20}}
    }
    if str(item_id) in catalog:
        return Item.from_dict(catalog[str(item_id)])
    return None
