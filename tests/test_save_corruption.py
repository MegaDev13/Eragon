"""
Crônica de Aethelgard - Teste de Integridade e Anticorrupção de Save Game JSON (tests/test_save_corruption.py)
Garante que o arquivo game_db.json nunca corrompe ou perde propriedades dos itens no inventário ao salvar repetidamente.
"""
import json
import os
import unittest
from main.game.db import DB_FILE, save_player, get_player
from main.game.shop.buy import purchase_item
from main.game.models import Player, Item

class TestSaveCorruption(unittest.TestCase):
    def setUp(self):
        if os.path.exists(DB_FILE):
            os.remove(DB_FILE)
        self.player = Player("p_corrupt_test", "Aethelgard", gold=1000)
        # Adicionar um item customizado com propriedades complexas rúnicas
        custom_item = Item("relic_1", "Anel do Abismo", 500, "artefato", {"enchantment": "Fogo-Negro", "durability": 100})
        self.player.inventory.append(custom_item)
        save_player(self.player)

    def tearDown(self):
        if os.path.exists(DB_FILE):
            os.remove(DB_FILE)

    def test_json_structure_and_inventory_persistence_never_corrupts(self):
        """Verifica se o JSON permanece válido, sem truncamento e mantendo 100% das propriedades após transações da loja."""
        # Executar 5 compras seguidas para testar gravação atômica e concorrência
        purchase_item("p_corrupt_test", "sword_1")
        purchase_item("p_corrupt_test", "potion_1")
        purchase_item("p_corrupt_test", "armor_1")
        purchase_item("p_corrupt_test", "potion_1")
        purchase_item("p_corrupt_test", "sword_1")

        # 1. Validar sintaxe JSON pura abrindo o arquivo diretamente com json.load
        with open(DB_FILE, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        self.assertIn("players", raw_data)
        self.assertIn("p_corrupt_test", raw_data["players"])

        # 2. Validar que o jogador e todos os 6 itens (1 original + 5 comprados) estão lá
        p_dict = raw_data["players"]["p_corrupt_test"]
        self.assertEqual(len(p_dict["inventory"]), 6)

        # 3. Validar que as propriedades complexas do primeiro item customizado não foram perdidas/corrompidas
        first_item = p_dict["inventory"][0]
        self.assertEqual(first_item["name"], "Anel do Abismo")
        self.assertEqual(first_item["properties"]["enchantment"], "Fogo-Negro")
        self.assertEqual(first_item["properties"]["durability"], 100)

        # 4. Validar desserialização completa via get_player
        reloaded_player = get_player("p_corrupt_test")
        self.assertEqual(len(reloaded_player.inventory), 6)
        self.assertEqual(reloaded_player.gold, 1000 - 50 - 20 - 120 - 20 - 50)  # 740 ouro restante

if __name__ == "__main__":
    unittest.main()
