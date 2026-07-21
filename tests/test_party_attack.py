"""
Crônica de Aethelgard - Testes Unitários de Ataque em Party (tests/test_party_attack.py)
Testa a verificação de membros, cálculo agregado, distribuição e logs (3+ cenários).
"""
import unittest
from main.game.actions.attack import party_attack
from main.game.models import Character

class TestPartyAttack(unittest.TestCase):
    def setUp(self):
        self.attacker = Character("p1", "Aethel", strength=20, armor=10, hp=100, party_id="party_1")
        self.comp1 = Character("c1", "Borin", strength=15, armor=8, hp=80, party_id="party_1")
        self.comp2 = Character("c2", "Vespera", strength=18, armor=12, hp=90, party_id="party_1")
        self.comp3 = Character("c3", "Thalor", strength=12, armor=5, hp=70, party_id="party_1")
        self.enemy = Character("e1", "Gárgula", strength=25, armor=15, hp=200, party_id="enemy_party")

    def test_scenario_1_three_plus_members_attack_simultaneously(self):
        """Cenário 1: 3+ personagens na mesma party atacam simultaneamente e causam dano agregado."""
        party = [self.attacker, self.comp1, self.comp2, self.comp3]
        result = party_attack(self.attacker, self.enemy, party)
        
        self.assertTrue(result["success"])
        self.assertEqual(result["members_count"], 4)
        # Força total = 20 + 15 + 18 + 12 = 65. Defesa do inimigo = 15. Dano agregado = 65 - 15 = 50.
        self.assertEqual(result["damage"], 50)
        self.assertEqual(self.enemy.hp, 150)  # 200 - 50 = 150
        self.assertIn("Party ataca por 50 de dano", result["message"])

    def test_scenario_2_non_party_members_excluded(self):
        """Cenário 2: Personagens que não pertencem à party do atacante são excluídos do cálculo."""
        rival = Character("r1", "Kaelen", strength=30, party_id="rival_party")
        party = [self.attacker, self.comp1, rival]
        result = party_attack(self.attacker, self.enemy, party)
        
        self.assertTrue(result["success"])
        self.assertEqual(result["members_count"], 2)  # Apenas Aethel e Borin
        self.assertNotIn("Kaelen", result["member_names"])

    def test_scenario_3_friendly_fire_prevention(self):
        """Cenário 3: Tentar atacar um alvo que pertence à mesma party é bloqueado."""
        target_ally = Character("c4", "Orin", strength=10, hp=100, party_id="party_1")
        party = [self.attacker, self.comp1]
        result = party_attack(self.attacker, target_ally, party)
        
        self.assertFalse(result["success"])
        self.assertEqual(result["damage"], 0)
        self.assertEqual(target_ally.hp, 100)
        self.assertIn("pertence à mesma party do atacante", result["message"])

if __name__ == "__main__":
    unittest.main()
