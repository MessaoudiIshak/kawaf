# Documentation du Schéma Prisma

## Table: User (Utilisateur)

| Attributs | Explication |
|-----------|-------------|
| id | Identifiant unique de l'utilisateur, généré automatiquement |
| email | Adresse e-mail unique de l'utilisateur |
| password | Mot de passe haché de l'utilisateur pour la sécurité |
| role | Rôle de l'utilisateur (ADMIN ou USER) |
| createdAt | Date et heure de création du compte |
| updatedAt | Date et heure de la dernière modification |

---

## Table: MenuItem (Élément de Menu)

| Attributs | Explication |
|-----------|-------------|
| id | Identifiant unique de l'élément du menu |
| name | Nom unique de l'élément du menu |
| description | Description courte et optionnelle de l'élément |
| price | Prix de l'élément avec deux décimales (format: 0.00) |
| photoUrl | Lien vers la photo de l'élément (optionnel) |
| popularity | Nombre de fois que l'élément a été commandé (commence à 0) |
| isAvailable | Indique si l'élément est disponible ou non |
| createdAt | Date et heure de création de l'élément |
| updatedAt | Date et heure de la dernière modification |

---

## Table: Animal (Animal)

| Attributs | Explication |
|-----------|-------------|
| id | Identifiant unique de l'animal |
| name | Nom de l'animal |
| photoUrl | Lien vers la photo de l'animal (optionnel) |
| age | Âge de l'animal en années (optionnel) |
| weight | Poids de l'animal en kilogrammes (optionnel) |
| sex | Sexe de l'animal - MALE ou FEMALE (optionnel) |
| temperament | Description du caractère de l'animal (optionnel) |
| story | Histoire ou description complète de l'animal (optionnel) |
| isAdopted | Indique si l'animal a été adopté ou non |
| createdAt | Date et heure de création du profil |
| updatedAt | Date et heure de la dernière modification |

---

## Table: Event (Événement)

| Attributs | Explication |
|-----------|-------------|
| id | Identifiant unique de l'événement |
| title | Titre de l'événement |
| description | Description détaillée de l'événement (optionnel) |
| date | Date et heure de l'événement |
| photoUrl | Lien vers la photo de l'événement (optionnel) |
| location | Lieu où l'événement aura lieu (optionnel) |
| createdAt | Date et heure de création de l'événement |
| updatedAt | Date et heure de la dernière modification |

---

## Énumérations

### Enum: Role
- **ADMIN** - Administrateur avec accès complet
- **USER** - Utilisateur standard avec accès limité

### Enum: Sex
- **MALE** - Sexe masculin
- **FEMALE** - Sexe féminin
