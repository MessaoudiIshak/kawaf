# 🎨 Kawaf - Document de Transmission Design

> **Dernière mise à jour :** 15 janvier 2026  
> **Projet :** Site web Kawaf Cat Café  
> **Statut :** Backend terminé, Développement Frontend en attente

---

## 📋 Résumé du Projet

Kawaf est un site web pour un bar à chats qui combine :
- Un **menu du café** présentant les boissons et plats
- Une **galerie d'adoption** mettant en avant les chats à adopter
- Un **calendrier d'événements** pour les activités communautaires
- Un **panneau d'administration sécurisé** pour que le personnel gère tout le contenu

---

## ✅ Ce qui est déjà construit (Backend)

L'ensemble du système backend est terminé et prêt à alimenter le site. Voici ce qu'il peut faire :

### 🐱 Animaux / Galerie d'Adoption
- Afficher tous les chats disponibles à l'adoption
- Montrer les profils détaillés : nom, photo, âge, poids, personnalité et leur histoire
- Marquer les chats comme adoptés (ils disparaissent de la vue publique)
- Ajouter, modifier ou supprimer des profils d'animaux

### 🍽️ Menu du Café
- Afficher tous les articles du menu avec prix et descriptions
- Montrer les photos et les notes de popularité des articles
- Marquer les articles comme disponibles ou indisponibles (les articles indisponibles sont cachés aux clients)
- Ajouter, modifier ou supprimer des articles du menu

### 📅 Événements
- Afficher les événements à venir et récents
- Montrer les détails : titre, description, date, lieu et photo
- Les événements de plus de 7 jours sont automatiquement cachés du public
- Ajouter, modifier ou supprimer des événements

### 👤 Gestion des Utilisateurs
- Système de connexion sécurisé pour le personnel
- Créer de nouveaux comptes (Admin uniquement)
- Voir tous les utilisateurs enregistrés (Admin uniquement)

---

## 🚧 Fonctionnalités en Développement

Ces fonctionnalités sont prévues et seront construites prochainement :

### 📝 Formulaire de Demande d'Adoption
- Les visiteurs peuvent soumettre une demande d'adoption directement depuis le profil d'un chat
- Champs du formulaire : nom, email, téléphone, message, méthode de contact préférée
- La soumission envoie une notification au personnel du café
- Email de confirmation envoyé au visiteur

### 📬 Formulaire de Contact
- Demandes générales, réservations, questions sur les événements
- Champs du formulaire : nom, email, sujet, message
- Réponse automatique de confirmation à l'expéditeur
- Le personnel reçoit un email de notification

### 📱 Système de Swipe QR Code ("Cat Tinder")
- Expérience interactive pour les visiteurs au café
- Scanner un QR code pour ouvrir l'interface de swipe sur son téléphone
- Swiper les profils de chats (j'aime/passer)
- Voir ses chats "aimés" à la fin
- Partager les résultats avec le personnel pour discuter de l'adoption
- Une façon amusante et engageante de découvrir son compagnon idéal !

### 📧 Services Email
Emails automatisés pour :
| Type d'Email | Déclencheur | Destinataire |
|--------------|-------------|--------------|
| Demande d'Adoption | Formulaire soumis | Personnel + Visiteur (confirmation) |
| Message de Contact | Formulaire soumis | Personnel + Visiteur (confirmation) |
| Vérification de Compte | Nouvel utilisateur créé | Nouvel utilisateur |
| Réinitialisation de Mot de Passe | Demande effectuée | Utilisateur |
| Mise à jour du Statut d'Adoption | Chat marqué comme adopté | Anciens demandeurs (optionnel) |

---

## 🔐 Rôles et Contrôle d'Accès

Le système a **quatre niveaux d'accès**. Cela détermine ce que chaque personne peut voir et faire :

| Rôle | Qui est-ce ? | Que peuvent-ils voir ? | Que peuvent-ils faire ? |
|------|--------------|------------------------|-------------------------|
| **Public** | Toute personne visitant le site | Uniquement les articles disponibles, chats non adoptés, événements récents | Navigation uniquement (pas de modification) |
| **Utilisateur** | Utilisateurs basiques enregistrés | Comme le public | Peut ajouter/modifier/supprimer du contenu |
| **Staff** | Employés du café | **Tout** (y compris les éléments cachés) | Peut ajouter/modifier/supprimer du contenu |
| **Admin** | Gérants/Propriétaires | **Tout** | Contrôle total + peut créer de nouveaux comptes |

### Ce que signifie le contenu "Caché" :
- **Animaux :** Les chats marqués comme "adoptés" sont cachés aux clients mais visibles pour le Staff/Admin
- **Menu :** Les articles marqués comme "indisponibles" sont cachés aux clients mais visibles pour le Staff/Admin
- **Événements :** Les événements de plus de 7 jours sont cachés aux clients mais visibles pour le Staff/Admin

---

## 🖥️ Fonctionnalités de l'Interface Admin (À Concevoir)

Le panneau d'administration doit supporter ces actions :

### Page de Connexion
- Champs email et mot de passe
- Bouton "Connexion"
- Messages d'erreur pour les mauvais identifiants

### Tableau de Bord (Après Connexion)
- Écran d'accueil/aperçu
- Navigation vers : Animaux, Menu, Événements, Utilisateurs (Admin uniquement)

### Gestion des Animaux
| Action | Description |
|--------|-------------|
| Voir Tout | Tableau/grille de tous les animaux (y compris les adoptés) |
| Ajouter | Formulaire : nom, URL photo, âge, poids, sexe, tempérament, histoire |
| Modifier | Même formulaire, pré-rempli avec les données existantes |
| Supprimer | Confirmation avant suppression |
| Basculer Adoption | Bouton/switch pour marquer comme adopté/disponible |

### Gestion du Menu
| Action | Description |
|--------|-------------|
| Voir Tout | Tableau/grille de tous les articles (y compris indisponibles) |
| Ajouter | Formulaire : nom, description, prix, URL photo, popularité |
| Modifier | Même formulaire, pré-rempli avec les données existantes |
| Supprimer | Confirmation avant suppression |
| Basculer Disponibilité | Bouton/switch pour afficher/cacher du public |

### Gestion des Événements
| Action | Description |
|--------|-------------|
| Voir Tout | Tableau/grille de tous les événements (y compris passés) |
| Ajouter | Formulaire : titre, description, date/heure, lieu, URL photo |
| Modifier | Même formulaire, pré-rempli avec les données existantes |
| Supprimer | Confirmation avant suppression |

### Gestion des Utilisateurs (Admin Uniquement)
| Action | Description |
|--------|-------------|
| Voir Tout | Tableau de tous les utilisateurs (email, rôle, date de création) |
| Ajouter | Formulaire : nom, email, mot de passe, sélection du rôle |

---

## 🌐 Pages du Site Public (À Concevoir)

### Page d'Accueil
- Section héro avec présentation du café
- Chats vedettes disponibles à l'adoption
- Aperçu des articles du menu
- Aperçu des événements à venir

### Page Menu
- Grille/liste de tous les articles **disponibles**
- Chaque article affiche : photo, nom, description, prix
- Optionnel : filtre par catégorie, tri par popularité

### Page Adoption
- Galerie des chats **non adoptés**
- Chaque chat affiche : photo, nom, âge, brève description
- Cliquer pour voir le profil complet avec personnalité et histoire

### Page Événements
- Liste des événements à venir et récents (7 derniers jours)
- Chaque événement affiche : photo, titre, date, lieu, description

### Page Animal Individuelle
- Vue profil complète pour un chat
- Grande photo, tous les détails, infos pour demande d'adoption

### Page Événement Individuelle
- Détails complets pour un événement
- Grande photo, description complète, infos de localisation

### Page Demande d'Adoption
- Formulaire pour soumettre une demande d'adoption
- Affiche quel chat concerne la demande
- Champs : nom, email, téléphone, message
- Confirmation de succès après soumission

### Page Contact
- Formulaire de contact général
- Adresse du café, téléphone, horaires
- Carte intégrée (optionnel)
- Liens réseaux sociaux

### Expérience Swipe QR (Mobile-First)
- Cartes photo de chats en plein écran
- Gestes swipe gauche (passer) / droite (j'aime)
- Appuyer pour plus de détails
- Écran résultats montrant les chats aimés
- Partager ou sauvegarder les résultats

---

## 📱 Considérations Design

### Design Responsive
- Approche mobile-first recommandée
- Le panneau admin peut être orienté desktop

### Accessibilité
- Texte alternatif pour toutes les images
- Contraste de couleurs suffisant
- Support de navigation au clavier

### Opportunités de Branding
- Illustrations sur le thème des chats
- Palette de couleurs chaude et accueillante
- Typographie ludique pour les titres

---

## 🔜 Prochaines Étapes

1. **Développement Frontend** - Construire les pages du site public
2. **Interface Admin** - Créer l'interface de gestion
3. **Backend Formulaires** - Traitement des formulaires d'adoption et contact
4. **Intégration Email** - Configurer les notifications email automatiques
5. **Système Swipe QR** - Expérience interactive de matching avec les chats
6. **Upload d'Images** - Actuellement utilise des liens URL ; ajout possible d'upload de fichiers plus tard

---

## 💬 Questions ?

Si vous avez besoin de clarifications sur les fonctionnalités ou les règles d'accès, contactez l'équipe de développement.
