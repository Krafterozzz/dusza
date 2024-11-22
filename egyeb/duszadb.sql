-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2024. Nov 10. 15:36
-- Kiszolgáló verziója: 8.0.39-0ubuntu0.22.04.1
-- PHP verzió: 8.3.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `duszadb`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`, `role`) VALUES
(7, 'duszadb1', 'a42ea1cbd85f438af89bc8f65f6a6f5c85b4da1cd6ca809d63482020291d741b', 'admin'),
(8, 'duszadb2', '339dc0bbf0a0900dac6161ca3d642883ef49af7f68edf94f69771522ba846ade', 'admin');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `applications`
--

CREATE TABLE `applications` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_member1_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_member1_grade` int NOT NULL,
  `team_member2_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_member2_grade` int NOT NULL,
  `team_member3_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_member3_grade` int NOT NULL,
  `substitute_member_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `substitute_member_grade` int DEFAULT NULL,
  `teacher` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('kategori1','kategori2','kategori3') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `programming_language` enum('python','java','javascript','csharp') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `organizer_approval` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int DEFAULT NULL,
  `programming_language_id` int DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `applications`
--

INSERT INTO `applications` (`id`, `username`, `password`, `team_name`, `school_name`, `team_member1_name`, `team_member1_grade`, `team_member2_name`, `team_member2_grade`, `team_member3_name`, `team_member3_grade`, `substitute_member_name`, `substitute_member_grade`, `teacher`, `category`, `programming_language`, `organizer_approval`, `created_at`, `category_id`, `programming_language_id`, `file_name`) VALUES
(134, 'zsombi.futo@gmail.com', '$2y$10$phSmVwXR47djLRztyIMBv.b1a3iIzp6oM8y6pRClMGw575ib/K.xW', 'zsombi', 'zsombi.futo@gmail.com', 'idemitirjak', 2, 'zsombi.futo@gmail.com', 3, 'zsombi.futo@gmail.com', 2, '', 0, 'zsombi.futo@gmail.com', 'kategori1', 'python', 'rejected', '2024-11-10 12:42:51', NULL, NULL, NULL),
(136, 'mszc-kando', '$2y$10$rY6N4RpJJdfWZFnnDbEOxeewmL4KwKdD2XxOrFW4LaAfMoPvTg05e', 'Amatőrök', 'Miskolci SZC Kandó Kálmán Informatikai Technikum', 'Futó Zsombor', 9, 'Szabó Máté', 9, 'Szűcs Noel Gergő', 9, NULL, NULL, 'Kasza László Róbert', 'kategori3', 'javascript', 'pending', '2024-11-10 15:21:28', NULL, NULL, NULL),
(137, 'gardonyi-g', '$2y$10$ddgAK8FFwT8KFNIZLYYl8eoR5LJXrOsIIdPhyoAzvPhDKcas5EJrS', 'A Gárdonyisok', 'Gárdonyi Géza Kat. Ált. Isk. és Óvoda', 'Mekk Elek', 8, 'Kis Pista', 8, 'Tóth Zoltán', 8, NULL, NULL, 'Berkőné Áll Marianna', 'kategori2', 'java', 'pending', '2024-11-10 15:22:57', NULL, NULL, NULL),
(138, 'teszt123', '$2y$10$yARP5/q9MPT4OcCPyldxU.D/yxX4x7PkcD8I.lTe/mJDZNFlNudBi', 'teszt123', 'teszt123', 'teszt123', 9, 'teszt123', 9, 'teszt123', 9, NULL, NULL, 'teszt123', 'kategori3', 'csharp', 'pending', '2024-11-10 15:23:36', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(8, 'Könnyű'),
(9, 'Nehéz'),
(10, 'Közepes');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `programming_languages`
--

CREATE TABLE `programming_languages` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `programming_languages`
--

INSERT INTO `programming_languages` (`id`, `name`) VALUES
(9, 'asd'),
(8, 'HTMLasd'),
(4, 'Java'),
(1, 'Python');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `registration_deadline`
--

CREATE TABLE `registration_deadline` (
  `id` int NOT NULL,
  `deadline` datetime NOT NULL,
  `registration_closed` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `registration_deadline`
--

INSERT INTO `registration_deadline` (`id`, `deadline`, `registration_closed`) VALUES
(4, '2024-11-21 11:11:00', 0);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `programming_language_id` (`programming_language_id`);

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `programming_languages`
--
ALTER TABLE `programming_languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `registration_deadline`
--
ALTER TABLE `registration_deadline`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `programming_languages`
--
ALTER TABLE `programming_languages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `registration_deadline`
--
ALTER TABLE `registration_deadline`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`programming_language_id`) REFERENCES `programming_languages` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
