"""
Crônica de Aethelgard - Sistema de Loja e Compra de Itens (main/game/shop/buy.py)
Implementa a função purchase_item com validação de ouro, persistência atômica e atualização do inventário.
"""
import logging
from main.game.db import get_player, save_player, get_item_template
from main.game.models import Item

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("ShopBuy")

def purchase_item(player_id, item_id):
    """
    Fluxo correto de compra de item:
    1. Validar se player existe e se tem gold suficiente para o preço do item.
    2. Debitar gold do player.
    3. Instanciar objeto Item completo com propriedades.
    4. Adicionar ao array inventory[] do player.
    5. Salvar no banco de dados (JSON atômico anticorrupção).
    6. Retornar estrutura com status, inventário atualizado e sinalizador para atualização da interface.
    """
    try:
        player = get_player(player_id)
        if not player:
            logger.error(f"[PurchaseItem] Jogador não encontrado com ID: {player_id}")
            return {
                "success": False,
                "message": f"Jogador não encontrado: {player_id}"
            }

        item_template = get_item_template(item_id)
        if not item_template:
            logger.error(f"[PurchaseItem] Item não cadastrado no catálogo: {item_id}")
            return {
                "success": False,
                "message": f"Item não encontrado no catálogo: {item_id}"
            }

        # 1. Validar se player tem gold suficiente
        if player.gold < item_template.price:
            logger.warning(f"[PurchaseItem] Ouro insuficiente para {player.name}: possui {player.gold}, item custa {item_template.price}")
            return {
                "success": False,
                "message": f"Ouro insuficiente! Você possui {player.gold} ouro, mas '{item_template.name}' custa {item_template.price}."
            }

        # 2. Debitar gold do player
        player.gold -= item_template.price

        # 3. Instanciar objeto Item com propriedades
        # Gerar uma nova instância do Item para garantir propriedades independentes (durabilidade, etc.)
        purchased_item = Item(
            item_id=item_template.item_id,
            name=item_template.name,
            price=item_template.price,
            item_type=item_template.item_type,
            properties=dict(item_template.properties)
        )

        # 4. Adicionar ao array inventory[] do player
        player.inventory.append(purchased_item)

        # 5. Salvar no banco de dados (JSON com trava e arquivo atômico)
        save_success = save_player(player)
        if not save_success:
            raise RuntimeError("Falha ao salvar estado do jogador no banco de dados após a compra.")

        logger.info(f"[PurchaseItem] Sucesso! {player.name} comprou '{purchased_item.name}' por {purchased_item.price} ouro. Ouro restante: {player.gold}. Inventário total: {len(player.inventory)} itens.")

        # 6. Atualizar interface graficamente (estrutura de dados retornada para renderização no front-end)
        return {
            "success": True,
            "message": f"Você adquiriu '{purchased_item.name}' por {purchased_item.price} moedas de ouro!",
            "player_id": player.id,
            "remaining_gold": player.gold,
            "inventory_count": len(player.inventory),
            "purchased_item": purchased_item.to_dict(),
            "updated_inventory": [i.to_dict() if hasattr(i, 'to_dict') else i for i in player.inventory],
            "ui_update_required": True
        }

    except Exception as e:
        logger.error(f"[PurchaseItem Error] Exceção durante compra de item: {str(e)}")
        return {
            "success": False,
            "message": f"Erro interno ao processar compra do item {item_id}: {str(e)}"
        }
