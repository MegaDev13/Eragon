"""
Crônica de Aethelgard - Sistema de Ataque em Grupo / Party (main/game/actions/attack.py)
Implementa a função party_attack com verificação de membros, cálculo agregado e log formatado.
"""
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("PartyAttack")

def party_attack(attacker, target, party_members):
    """
    Executa o ataque sincronizado de uma party contra um alvo.
    
    1. Verificação se atacante e membros estão na mesma party, e se alvo NÃO está na mesma party.
    2. Cálculo de dano agregado: (soma de forças - defesa do alvo), com bônus de sinergia.
    3. Distribuição do contra-ataque/dano entre os membros da party se o alvo retaliar.
    4. Log de batalha formatado e retorno com a mensagem da interface: "Party ataca por X de dano (...)"
    """
    try:
        if not attacker or not target or not party_members:
            raise ValueError("Parâmetros inválidos para ataque em party (attacker, target ou party_members ausentes).")

        # 1. Verificação se atacante e membros pertencem à mesma party e estão vivos
        valid_members = []
        attacker_party_id = getattr(attacker, 'party_id', None)

        for member in party_members:
            # Checar se membro está vivo e compartilha do mesmo ID de party do atacante (ou se compõem o grupo ativo)
            if getattr(member, 'is_alive', True):
                member_party_id = getattr(member, 'party_id', None)
                # Se ambos têm party_id e coincidem, ou se não têm restrição de ID externa, incluir
                if attacker_party_id and member_party_id:
                    if str(attacker_party_id) == str(member_party_id):
                        valid_members.append(member)
                    else:
                        logger.warning(f"[PartyAttack] Personagem {member.name} recusado: party_id {member_party_id} difere de {attacker_party_id}")
                else:
                    valid_members.append(member)

        # Garantir que o próprio atacante está na lista de atacantes ativos
        if attacker not in valid_members and getattr(attacker, 'is_alive', True):
            valid_members.insert(0, attacker)

        if not valid_members:
            return {
                "success": False,
                "damage": 0,
                "message": "Nenhum membro ativo ou válido na party para realizar o ataque."
            }

        # Verificação: Alvo não pode pertencer à mesma party do atacante (fogo amigo bloqueado)
        target_party_id = getattr(target, 'party_id', None)
        if target_party_id and attacker_party_id and str(target_party_id) == str(attacker_party_id):
            return {
                "success": False,
                "damage": 0,
                "message": f"Ataque cancelado: o alvo {target.name} pertence à mesma party do atacante ({attacker_party_id})!"
            }

        # 2. Cálculo de dano agregado (soma das forças - defesa do alvo)
        total_strength = sum(getattr(m, 'strength', 10) for m in valid_members)
        target_armor = getattr(target, 'armor', 0)
        
        # Dano agregado final garantindo mínimo de 1 por membro participante se a força superar ou empatar
        aggregated_damage = max(len(valid_members), int(total_strength - target_armor))

        # Aplicar dano ao alvo
        if hasattr(target, 'take_damage'):
            target.take_damage(aggregated_damage)
        else:
            target.hp = max(0, getattr(target, 'hp', 100) - aggregated_damage)
            if target.hp <= 0:
                target.is_alive = False

        # 4. Log de batalha com nomes dos membros
        member_names = ", ".join(m.name for m in valid_members)
        ui_message = f"Party ataca por {aggregated_damage} de dano ({member_names})"
        logger.debug(f"[PartyAttack] {ui_message} | Força total: {total_strength} | Defesa alvo: {target_armor} | Alvo HP restante: {getattr(target, 'hp', 0)}")

        # 3. Distribuição de dano entre membros (simulação de retaliação em área se o alvo ainda estiver vivo)
        retaliation_damage = 0
        damage_per_member = 0
        if getattr(target, 'is_alive', True) and getattr(target, 'strength', 0) > 0:
            retaliation_damage = int(getattr(target, 'strength', 10) * 0.5)
            if retaliation_damage > 0:
                damage_per_member = max(1, retaliation_damage // len(valid_members))
                for member in valid_members:
                    if hasattr(member, 'take_damage'):
                        member.take_damage(damage_per_member)
                    else:
                        member.hp = max(0, getattr(member, 'hp', 100) - damage_per_member)
                logger.debug(f"[PartyAttack] Retaliação do alvo {target.name}: {damage_per_member} dano distribuído para cada um dos {len(valid_members)} membros.")

        return {
            "success": True,
            "damage": aggregated_damage,
            "members_count": len(valid_members),
            "member_names": [m.name for m in valid_members],
            "message": ui_message,
            "retaliation_distributed": damage_per_member
        }

    except Exception as e:
        logger.error(f"[PartyAttack Error] Erro inesperado em party_attack: {str(e)}")
        return {
            "success": False,
            "damage": 0,
            "message": f"Erro interno ao processar ataque em party: {str(e)}"
        }
