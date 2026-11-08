# Test de frappe

Mesure ta vitesse de frappe au clavier en mots par minute, avec ta précision, et suis tes progrès partie après partie.

*English version: [README.en.md](README.en.md)*

## Comment jouer

1. Choisis un mode : **au temps** (15 s, 30 s, 60 s ou 2 min) ou **aux mots** (25 ou 50 mots).
2. Commence à taper : le chrono démarre à la première lettre. Tape les mots affichés, séparés par **Espace**.
3. Chaque lettre juste s'affiche normalement, chaque faute en rouge ; une ligne en direct montre le temps restant (ou les mots tapés), ta vitesse et ta précision.
4. **Tab** ou **Échap** (ou le bouton **Recommencer**) relance une partie avec de nouveaux mots.

**Ponctuation et majuscules** ajoute des virgules, des points et des majuscules au texte, pour un test plus proche de l'écriture réelle.

Les mots sont tirés au hasard parmi les deux cents mots les plus courants de la langue.

## Le résultat

À la fin, une carte résume la partie :

- **Vitesse** : les mots justes par minute (un mot compte pour 5 caractères, comme dans les tests de frappe habituels) ;
- **Brute** : la vitesse en comptant aussi les caractères faux ;
- **Précision** : la part de touches tapées sans faute ;
- **Mots justes** sur les mots tapés, et le **temps**.

Un nouveau record dans le mode choisi est annoncé.

## Historique

Sous la zone de frappe, un graphique montre tes **20 dernières parties** dans le mode choisi, en mots par minute, avec ton record.

## Données et synchronisation

Tes records par mode et l'historique de tes 200 dernières parties sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Test de frappe → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
