"""
Crônica de Aethelgard - Modelos Base MVC (models/__init__.py)
Define as classes Character, Player, Item e Party para os módulos de ações, loja e combate.
"""
import json
import os
import random

class Item:
    def __init__(self, item_id, name, price, item_type="geral", properties=None):
        self.item_id = item_id
        self.name = name
        self.price = price
        self.item_type = item_type
        self.properties = properties or {}

    def to_dict(self):
        return {
            "item_id": self.item_id,
            "name": self.name,
            "price": self.price,
            "item_type": self.item_type,
            "properties": self.properties
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            item_id=data.get("item_id"),
            name=data.get("name"),
            price=data.get("price", 0),
            item_type=data.get("item_type", "geral"),
            properties=data.get("properties", {})
        )

class Character:
    def __init__(self, char_id, name, strength=10, armor=5, hp=100, max_hp=100, critical_chance=0.1, party_id=None):
        self.id = char_id
        self.name = name
        self.strength = strength
        self.armor = armor
        self.hp = hp
        self.max_hp = max_hp
        self.critical_chance = critical_chance
        self.party_id = party_id
        self.is_alive = True if hp > 0 else False

    def take_damage(self, amount):
        self.hp = max(0, int(self.hp - amount))
        if self.hp <= 0:
            self.is_alive = False
        return amount

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "strength": self.strength,
            "armor": self.armor,
            "hp": self.hp,
            "max_hp": self.max_hp,
            "critical_chance": self.critical_chance,
            "party_id": self.party_id,
            "is_alive": self.is_alive
        }

class Player(Character):
    def __init__(self, player_id, name, gold=100, strength=15, armor=10, hp=150, max_hp=150, critical_chance=0.15, party_id="party_1"):
        super().__init__(player_id, name, strength, armor, hp, max_hp, critical_chance, party_id)
        self.gold = gold
        self.inventory = []  # Lista de objetos Item ou dicts de Item

    def to_dict(self):
        base = super().to_dict()
        base["gold"] = self.gold
        base["inventory"] = [item.to_dict() if hasattr(item, 'to_dict') else item for item in self.inventory]
        return base

    @classmethod
    def from_dict(cls, data):
        p = cls(
            player_id=data.get("id"),
            name=data.get("name"),
            gold=data.get("gold", 0),
            strength=data.get("strength", 10),
            armor=data.get("armor", 5),
            hp=data.get("hp", 100),
            max_hp=data.get("max_hp", 100),
            critical_chance=data.get("critical_chance", 0.1),
            party_id=data.get("party_id")
        )
        p.inventory = [Item.from_dict(i) if isinstance(i, dict) else i for i in data.get("inventory", [])]
        return p
