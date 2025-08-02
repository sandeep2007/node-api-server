-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 02, 2025 at 09:06 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `api_server`
--

-- --------------------------------------------------------

--
-- Table structure for table `instance`
--

CREATE TABLE `instance` (
  `id` bigint(20) NOT NULL,
  `auth_key` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `instance`
--

INSERT INTO `instance` (`id`, `auth_key`) VALUES
(1, '64d13036-c2fc-4ce2-911d-e66952ce35bd');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_token`
--

CREATE TABLE `refresh_token` (
  `id` bigint(20) NOT NULL,
  `token` varchar(1000) NOT NULL,
  `timestamp` varchar(100) NOT NULL,
  `device_token` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` bigint(20) NOT NULL,
  `data` varchar(5000) NOT NULL,
  `timestamp` varchar(100) NOT NULL,
  `token` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `uniq_key` varchar(100) NOT NULL,
  `date_created` varchar(100) NOT NULL,
  `date_updated` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `instance`
--
ALTER TABLE `instance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auth_key` (`auth_key`);

--
-- Indexes for table `refresh_token`
--
ALTER TABLE `refresh_token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `token_2` (`token`),
  ADD KEY `device_token` (`device_token`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_2` (`token`),
  ADD KEY `token` (`token`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `uniq_key` (`uniq_key`),
  ADD KEY `email` (`email`),
  ADD KEY `phone_2` (`phone`),
  ADD KEY `uniq_key_2` (`uniq_key`),
  ADD KEY `status` (`status`),
  ADD KEY `date_updated` (`date_updated`),
  ADD KEY `date_created` (`date_created`),
  ADD KEY `password` (`password`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `instance`
--
ALTER TABLE `instance`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `refresh_token`
--
ALTER TABLE `refresh_token`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
