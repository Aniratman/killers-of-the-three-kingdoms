import { JsonAsset } from 'cc';
import { Card, Character, Spell } from '../common/CommonStructs';
import { theResourceManager } from './ResourceManger';

export default class ConfigManager {
    private static __instance: ConfigManager = null;
    static get instance() {
        if (!this.__instance) {
            this.__instance = new ConfigManager();
        }
        return this.__instance;
    }

    public characters: Character[] = null;
    public cards: Card[] = null;
    public spells: Map<number, Spell> = null;

    private constructor() {
        this.characters = [];
        this.cards = [];
        this.spells = new Map<number, Spell>();
    }

    async init() {
        console.time('load config');
        await Promise.all([this.parseCharacterJson(), this.parseCardJson(), this.parseSpellJson()]);
        console.timeEnd('load config');
        this.fillterUseableCharacters();
    }

    async parseCharacterJson() {
        const [asset] = await theResourceManager.loadResource('configs/character', JsonAsset);
        for (const element of asset.json.CardConfig.Character) {
            const character: Character = {
                id: Number(element.id),
                name: element.name,
                country: Number(element.country),
                sex: Number(element.sex),
                life: Number(element.life),
                spells: [],
            };
            let index: number = 1;
            while (element[`SpellID${index}`]) {
                character.spells.push(Number(element[`SpellID${index}`]));
                ++index;
            }
            this.characters.push(character);
        }
    }

    async parseCardJson() {
        const [asset] = await theResourceManager.loadResource('configs/card', JsonAsset);

        for (const card of asset.json.CardConfig.PlayCard) {
            this.cards.push({
                id: Number(card.id),
                name: card.name,
                cardType: Number(card.cardType),
                cardSubType: Number(card.cardSubType),
                number: Number(card.number),
                color: Number(card.color),
                distanceWeapon: Number(card.distanceWeapon),
                distanceAttackHorse: Number(card.distanceAttackHorse),
                distanceDefanceHorse: Number(card.distanceDefanceHorse),
                spell: Number(card.spellId),
                pictureId: Number(card.pictureId),
            });
        }
    }

    async parseSpellJson() {
        const [asset] = await theResourceManager.loadResource('configs/spell', JsonAsset);
        for (const spell of asset.json.CardConfig.Spell) {
            const spellId = Number(spell.id);
            if (!this.spells.has(spellId)) {
                this.spells.set(spellId, {
                    id: spellId,
                    name: spell.name,
                    type: Number(spell.type),
                    desc: spell.desc,
                });
            } else {
                console.error(`spell ${spell.id} is conflict`);
            }
        }
    }

    querySpell(spellId: number) {
        const spell = this.spells.get(spellId);
        if (!spell) {
            console.error(`miss spell ${spellId}`);
        }
        return spell;
    }

    fillterUseableCharacters() {
        const characters: Character[] = [];
        for (const character of this.characters) {
            let flag: boolean = true;
            for (const spellId of character.spells) {
                if (!this.spells.has(spellId)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                characters.push(character);
            }
        }
        this.characters = characters;
    }
}

export const theConfigManager = ConfigManager.instance;
