"""
Crônica de Aethelgard - Sistema de Combate Tático MVC (main/game/combat/combat.py)
Implementa a classe CombatSystem com cálculo de armadura, críticos, turnos alternados e checagem de morte.
"""
import logging
import random

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("CombatSystem")

class CombatSystem:
    def __init__(self):
        self.turn_number = 1
        self.combat_log = []
        self.is_combat_active = False

    def show_critical_hit(self, attacker_name):
        """
        Registra no log e emite sinalização de acerto crítico para a interface.
        """
        msg = f"💥 GOLPE CRÍTICO DE {attacker_name.upper()}!"
        self.combat_log.append({"turn": self.turn_number, "type": "critical", "message": msg})
        logger.debug(f"[CombatSystem] {msg}")
        return msg

    def calculate_damage(self, attacker, defender):
        """
        Cálculo de dano considerando variação aleatória de força, redução por armadura e chance crítica.
        """
        try:
            attacker_str = getattr(attacker, 'strength', 10)
            defender_armor = getattr(defender, 'armor', 0)
            crit_chance = getattr(attacker, 'critical_chance', 0.1)

            base_damage = attacker_str * random.uniform(0.9, 1.1)
            damage_reduction = defender_armor * 0.1
            final_damage = max(1, base_damage - damage_reduction)

            # Checar ataque crítico
            if random.random() < crit_chance:
                final_damage *= 2
                self.show_critical_hit(attacker.name)

            final_damage = int(round(final_damage))
            return max(1, final_damage)
        except Exception as e:
            logger.error(f"[CombatSystem Error] Erro ao calcular dano: {str(e)}")
            return 1

    def execute_turn(self, attacker, defender):
        """
        Executa um único turno onde o atacante desfere um golpe contra o defensor.
        Verifica imediatamente a morte para interromper o combate caso o defensor caia.
        """
        if not getattr(attacker, 'is_alive', True) or getattr(attacker, 'hp', 0) <= 0:
            msg = f"Ataque cancelado: o atacante {attacker.name} está desmaiado ou morto."
            self.combat_log.append({"turn": self.turn_number, "type": "error", "message": msg})
            return {"combat_active": False, "message": msg, "winner": defender.name}

        if not getattr(defender, 'is_alive', True) or getattr(defender, 'hp', 0) <= 0:
            msg = f"Ataque cancelado: o alvo {defender.name} já foi derrotado em combate."
            self.combat_log.append({"turn": self.turn_number, "type": "error", "message": msg})
            return {"combat_active": False, "message": msg, "winner": attacker.name}

        dmg = self.calculate_damage(attacker, defender)
        
        # Aplicar dano no defensor
        if hasattr(defender, 'take_damage'):
            defender.take_damage(dmg)
        else:
            defender.hp = max(0, getattr(defender, 'hp', 100) - dmg)
            if defender.hp <= 0:
                defender.is_alive = False

        msg = f"Turno {self.turn_number}: {attacker.name} ataca {defender.name} causando {dmg} de dano! ({defender.hp}/{getattr(defender, 'max_hp', 100)} HP restantes)"
        self.combat_log.append({"turn": self.turn_number, "type": "attack", "message": msg, "damage": dmg})
        logger.info(f"[CombatSystem] {msg}")

        # Checar interrupção por morte
        if defender.hp <= 0 or not getattr(defender, 'is_alive', True):
            self.is_combat_active = False
            win_msg = f"🏆 {defender.name} caiu! {attacker.name} é o vencedor da batalha!"
            self.combat_log.append({"turn": self.turn_number, "type": "victory", "message": win_msg})
            logger.info(f"[CombatSystem] {win_msg}")
            return {
                "combat_active": False,
                "turn": self.turn_number,
                "damage": dmg,
                "defender_hp": 0,
                "winner": attacker.name,
                "message": win_msg
            }

        self.turn_number += 1
        return {
            "combat_active": True,
            "turn": self.turn_number - 1,
            "damage": dmg,
            "defender_hp": defender.hp,
            "message": msg
        }

    def run_full_combat(self, char_a, char_b, max_turns=50):
        """
        Executa um combate completo alternando os turnos entre char_a e char_b até que um deles morra.
        Garante que a morte interrompe o loop imediatamente.
        """
        self.turn_number = 1
        self.is_combat_active = True
        self.combat_log = []

        current_attacker = char_a
        current_defender = char_b

        while self.is_combat_active and self.turn_number <= max_turns:
            result = self.execute_turn(current_attacker, current_defender)
            if not result["combat_active"]:
                break
            # Alternar turnos de forma precisa
            current_attacker, current_defender = current_defender, current_attacker

        winner = char_a.name if getattr(char_a, 'hp', 0) > 0 else char_b.name
        return {
            "winner": winner,
            "total_turns": self.turn_number,
            "log": self.combat_log
        }
