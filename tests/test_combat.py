"""
Crônica de Aethelgard - Testes Unitários do Sistema de Combate (tests/test_combat.py)
Testa o cálculo com armadura, dano crítico, alternância de turnos e interrupção na morte (3+ cenários).
"""
import unittest
from unittest.mock import patch
from main.game.combat.combat import CombatSystem
from main.game.models import Character

class TestCombatSystem(unittest.TestCase):
    def setUp(self):
        self.combat = CombatSystem()
        self.attacker = Character("p1", "Aethel", strength=20, armor=10, hp=100, critical_chance=0.0)
        self.defender = Character("e1", "Wyvern", strength=15, armor=20, hp=100, critical_chance=0.0)

    @patch('random.uniform', return_value=1.0)
    @patch('random.random', return_value=0.5) # Sem crítico pois crit_chance = 0.0
    def test_scenario_1_damage_considers_armor_reduction(self, mock_rand, mock_unif):
        """Cenário 1: Cálculo de dano deduz exatamente a armadura do defensor (base_damage - armor * 0.1)."""
        # base_damage = 20 * 1.0 = 20. damage_reduction = 20 * 0.1 = 2. final_damage = 20 - 2 = 18.
        dmg = self.combat.calculate_damage(self.attacker, self.defender)
        self.assertEqual(dmg, 18)

    @patch('random.uniform', return_value=1.0)
    @patch('random.random', return_value=0.01) # Sempre crítico (0.01 < 0.5)
    def test_scenario_2_critical_strike_doubles_damage_and_logs(self, mock_rand, mock_unif):
        """Cenário 2: Quando ocorre crítico, o dano final é dobrado (final_damage * 2) e loga 'GOLPE CRÍTICO!'."""
        self.attacker.critical_chance = 0.5
        # base_damage = 20 - 2 = 18. Com crítico = 18 * 2 = 36.
        dmg = self.combat.calculate_damage(self.attacker, self.defender)
        self.assertEqual(dmg, 36)
        self.assertTrue(any("GOLPE CRÍTICO" in log["message"] for log in self.combat.combat_log))

    @patch('random.uniform', return_value=1.0)
    @patch('random.random', return_value=0.5)
    def test_scenario_3_turn_alternation_and_death_interruption(self, mock_rand, mock_unif):
        """Cenário 3: Os turnos alternam perfeitamente e quando um personagem cai para 0 HP, o combate para na hora."""
        # Colocar o defensor com apenas 10 HP para que morra no primeiro golpe do atacante (dano=18)
        self.defender.hp = 10
        result = self.combat.run_full_combat(self.attacker, self.defender)
        
        self.assertEqual(result["winner"], "Aethel")
        self.assertEqual(result["total_turns"], 1)  # Parou no primeiro turno exato da morte
        self.assertFalse(self.defender.is_alive)
        self.assertEqual(self.defender.hp, 0)
        self.assertIn("vencedor da batalha", result["log"][-1]["message"])

if __name__ == "__main__":
    unittest.main()
