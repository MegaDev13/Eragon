"""
Crônica de Aethelgard - Testes Unitários de Compra na Loja (tests/test_shop_buy.py)
Testa a validação de ouro, adição ao inventário, persistência atômica no banco e não corrupção do save game.
"""
import os
import unittest
from main.game.shop.buy import purchase_item
from main.game.db import get_player, save_player, DB_FILE
from main.game.models import Player

class TestShopBuy(unittest.TestCase):
    def setUp(self):
        # Limpar arquivo de banco temporário para testes consistentes
        if os.path.exists(DB_FILE):
            os.remove(DB_FILE)
        self.player = Player("player_test", "Aethel", gold=100)
        save_player(self.player)

    def tearDown(self):
        if os.path.exists(DB_FILE):
            os.remove(DB_FILE)

    def test_scenario_1_successful_purchase_and_inventory_update(self):
        """Cenário 1: Jogador com ouro suficiente compra item, saldo debita e item é adicionado ao inventário do banco."""
        result = purchase_item("player_test", "sword_1")
        self.assertTrue(result["success"])
        self.assertEqual(result["remaining_gold"], 50)  # 100 - 50 = 50
        self.assertEqual(result["inventory_count"], 1)
        self.assertTrue(result["ui_update_required"])
        
        # Verificar no banco recarregado se o item persiste exatamente
        saved_player = get_player("player_test")
        self.assertIsNotNone(saved_player)
        self.assertEqual(saved_player.gold, 50)
        self.assertEqual(len(saved_player.inventory), 1)
        self.assertEqual(saved_player.inventory[0].name, "Espada Longa Feudal")

    def test_scenario_2_insufficient_gold(self):
        """Cenário 2: Tentar comprar item mais caro que o ouro disponível falha e não debita nem adiciona item."""
        result = purchase_item("player_test", "armor_1")  # Custa 120 ouro, player tem 100
        self.assertFalse(result["success"])
        self.assertIn("Ouro insuficiente", result["message"])
        
        saved_player = get_player("player_test")
        self.assertEqual(saved_player.gold, 100)
        self.assertEqual(len(saved_player.inventory), 0)

    def test_scenario_3_save_game_json_integrity_after_multiple_purchases(self):
        """Cenário 3: Múltiplas compras não corrompem o JSON do banco de dados e preservam todos os itens."""
        purchase_item("player_test", "potion_1")  # -20
        purchase_item("player_test", "sword_1")   # -50
        purchase_item("player_test", "potion_1")  # -20 -> total 90, resta 10 ouro
        
        saved_player = get_player("player_test")
        self.assertEqual(saved_player.gold, 10)
        self.assertEqual(len(saved_player.inventory), 3)
        item_names = [i.name for i in saved_player.inventory]
        self.assertEqual(item_names.count("Poção de Cura"), 2)
        self.assertEqual(item_names.count("Espada Longa Feudal"), 1)

if __name__ == "__main__":
    unittest.main()
