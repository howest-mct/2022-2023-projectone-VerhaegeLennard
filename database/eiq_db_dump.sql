-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: eiq_db
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actie`
--

DROP TABLE IF EXISTS `actie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actie` (
  `ActieId` int NOT NULL AUTO_INCREMENT,
  `ActieBeschrijving` varchar(255) NOT NULL,
  PRIMARY KEY (`ActieId`),
  UNIQUE KEY `ActieId_UNIQUE` (`ActieId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actie`
--

LOCK TABLES `actie` WRITE;
/*!40000 ALTER TABLE `actie` DISABLE KEYS */;
INSERT INTO `actie` VALUES (1,'Open luik'),(2,'Geef voer'),(3,'Lees de tempertuur af'),(4,'Lees de vochtigheid af'),(5,'controleer de lichtintensiteit'),(6,'knop luik open ingedrukt'),(7,'knop uitschakelen ingedrukt');
/*!40000 ALTER TABLE `actie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device` (
  `DeviceId` int NOT NULL AUTO_INCREMENT,
  `Naam` varchar(255) NOT NULL,
  `Merk` varchar(45) DEFAULT NULL,
  `TypeId` int NOT NULL,
  `Beschrijving` varchar(255) DEFAULT NULL,
  `Aankoopkost` float NOT NULL,
  `Meeteenheid` varchar(25) NOT NULL,
  PRIMARY KEY (`DeviceId`),
  UNIQUE KEY `DeviceId_UNIQUE` (`DeviceId`),
  KEY `fk_Device_DeviceType1_idx` (`TypeId`),
  CONSTRAINT `fk_Device_DeviceType1` FOREIGN KEY (`TypeId`) REFERENCES `devicetype` (`TypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` VALUES (1,'Device A','XYZ',1,'Dummy text',100,'°C'),(2,'Device B','ABC',2,NULL,120,'ppm'),(3,'Device C','DEF',1,'Dummy text',200,'s'),(4,'Device D','PQR',1,NULL,120,'ppm'),(5,'Device E','MNO',2,'Dummy text',180,'%');
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devicetype`
--

DROP TABLE IF EXISTS `devicetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devicetype` (
  `TypeId` int NOT NULL AUTO_INCREMENT,
  `SoortType` varchar(45) NOT NULL,
  `TypeBeschrijving` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`TypeId`),
  UNIQUE KEY `TypeId_UNIQUE` (`TypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devicetype`
--

LOCK TABLES `devicetype` WRITE;
/*!40000 ALTER TABLE `devicetype` DISABLE KEYS */;
INSERT INTO `devicetype` VALUES (1,'Sensor','Lees waarden uit'),(2,'Actuator','Beinvloed parameters');
/*!40000 ALTER TABLE `devicetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gebruiker`
--

DROP TABLE IF EXISTS `gebruiker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gebruiker` (
  `GebruikerId` int NOT NULL AUTO_INCREMENT,
  `GebruikersNaam` varchar(150) NOT NULL,
  `Wachtwoord` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`GebruikerId`),
  UNIQUE KEY `GebruikerId_UNIQUE` (`GebruikerId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gebruiker`
--

LOCK TABLES `gebruiker` WRITE;
/*!40000 ALTER TABLE `gebruiker` DISABLE KEYS */;
INSERT INTO `gebruiker` VALUES (1,'Lennerd Verhaege','Wachtwoord123','lennard.eamail@email.be'),(2,'Jan Jaap','Wachtwoord567','email.dummy@dummymail.be');
/*!40000 ALTER TABLE `gebruiker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historiek`
--

DROP TABLE IF EXISTS `historiek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historiek` (
  `Volgnummer` int NOT NULL AUTO_INCREMENT,
  `DeviceId` int NOT NULL,
  `ActieId` int NOT NULL,
  `DatumTijd` datetime NOT NULL,
  `Waarde` float DEFAULT NULL,
  `Commentaar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Volgnummer`),
  UNIQUE KEY `Volgnummer_UNIQUE` (`Volgnummer`),
  KEY `fk_Historiek_Device_idx` (`DeviceId`),
  KEY `fk_Historiek_Actie1_idx` (`ActieId`),
  CONSTRAINT `fk_Historiek_Actie1` FOREIGN KEY (`ActieId`) REFERENCES `actie` (`ActieId`),
  CONSTRAINT `fk_Historiek_Device` FOREIGN KEY (`DeviceId`) REFERENCES `device` (`DeviceId`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historiek`
--

LOCK TABLES `historiek` WRITE;
/*!40000 ALTER TABLE `historiek` DISABLE KEYS */;
INSERT INTO `historiek` VALUES (1,3,1,'2023-05-22 08:30:15',37,'The sensor detected a temperature increase and activated the cooling system.'),(2,1,2,'2023-05-22 12:45:22',12,'Actuators adjusted the robotic arm\'s position to precisely grasp the object.'),(3,1,3,'2023-05-22 17:15:40',45,'Sensors measured the air quality and initiated the ventilation system for improved indoor atmosphere.'),(4,2,3,'2023-05-23 09:20:55',22,'Actuators regulated the flow of fuel to maintain a steady speed in the engine.'),(5,4,4,'2023-05-23 14:05:11',4,'The proximity sensor detected an obstacle, prompting the actuator to halt the moving platform.'),(6,3,1,'2023-05-23 19:30:02',19,'Sensors monitored the heart rate and alerted medical staff in case of irregularities.'),(7,5,2,'2023-05-24 11:55:27',33,'Actuators controlled the robotic prosthetic, allowing the user to grasp objects with precision.'),(8,5,3,'2023-05-24 16:40:15',7,'Sensors detected motion and triggered the security alarm system.'),(9,2,3,'2023-05-24 21:10:50',29,'Actuators adjusted the position of solar panels to maximize sunlight exposure and energy generation.'),(10,1,4,'2023-05-25 13:25:03',41,'The temperature sensor activated the heating system to maintain a comfortable room temperature.'),(11,5,1,'2023-05-25 18:15:08',14,'Sensors in a smart irrigation system monitored soil moisture levels and activated sprinklers when necessary.'),(12,4,2,'2023-05-25 23:00:33',49,'Actuators adjusted the wing flaps of an aircraft for stable flight in changing weather conditions.'),(13,3,3,'2023-05-26 10:45:47',9,'The pressure sensor activated the automatic door opener when someone approached.'),(14,2,3,'2023-05-26 15:20:55',26,'Actuators adjusted the suspension system in response to road conditions, ensuring a smooth ride.'),(15,1,4,'2023-05-26 19:50:30',2,'Sensors in a smart home detected light intensity and adjusted blinds or lighting accordingly.'),(16,3,1,'2023-05-27 08:15:44',39,'Actuators controlled the robotic vacuum cleaner, moving it around and cleaning the floors.'),(17,3,2,'2023-05-27 12:55:51',18,'The gas sensor detected a leak and triggered an alarm while shutting off the gas supply.'),(18,1,3,'2023-05-27 17:30:10',43,'Actuators adjusted the positioning of a satellite antenna for optimal signal reception.'),(19,1,3,'2023-05-28 09:40:25',8,'Sensors in a smart thermostat measured room temperature and activated the HVAC system for heating or cooling.'),(20,1,4,'2023-05-28 14:25:33',36,'Actuators opened and closed valves in an industrial process based on feedback from pressure sensors.'),(21,2,1,'2023-05-28 19:05:52',11,'The optical sensor detected a barcode and triggered the automated checkout process.'),(22,1,2,'2023-05-29 11:20:07',31,'Actuators adjusted the focus and zoom of a camera lens for capturing clear and detailed images.'),(23,4,3,'2023-05-29 16:10:15',47,'Sensors in a parking system detected vehicle presence and activated the barrier gate.'),(24,3,3,'2023-05-29 20:45:40',3,'Actuators controlled the robotic exoskeleton, assisting with movements for rehabilitation purposes.'),(25,2,4,'2023-05-30 13:00:55',25,'The light sensor detected low ambient light levels and activated the streetlights.'),(26,5,1,'2023-05-30 17:50:03',16,'Sensors in a vehicle\'s anti-lock braking system detected wheel lock-up and adjusted brake pressure accordingly.'),(27,3,2,'2023-05-30 22:35:28',44,'Actuators controlled the robotic arm in a manufacturing assembly line, precisely placing components.'),(28,1,3,'2023-05-31 10:50:33',5,'The humidity sensor activated the dehumidifier when the air moisture levels exceeded a threshold.'),(29,2,3,'2023-05-31 15:40:45',23,'Actuators adjusted the position and orientation of a satellite dish for optimal signal reception.'),(30,3,4,'2023-05-31 20:20:12',30,'Sensors in a home security system detected unauthorized entry and triggered the alarm.'),(31,4,1,'2023-06-01 12:35:27',10,'Actuators controlled the opening and closing of valves in an automated irrigation system.'),(32,4,2,'2023-06-01 17:25:35',50,'The tilt sensor detected an abnormal tilt angle and activated the stability control system in a vehicle.'),(33,3,3,'2023-06-01 22:05:58',28,'Sensors in a wearable fitness device measured heart rate and steps taken for activity tracking.'),(34,2,3,'2023-06-02 09:15:06',15,'Actuators adjusted the position of solar blinds based on the intensity of sunlight.'),(35,3,4,'2023-06-02 14:05:15',42,'The smoke detector sensed smoke particles and triggered the sprinkler system and alarms.'),(36,1,1,'2023-06-02 18:40:33',6,'Sensors in an autonomous vehicle detected obstacles and adjusted steering to avoid collisions.'),(37,2,2,'2023-06-03 11:00:47',32,'Actuators controlled the pitch and yaw of a drone for stable flight and navigation.'),(38,1,3,'2023-06-03 15:50:55',13,'The weight sensor detected an overloaded condition and activated an alarm in an elevator.'),(39,2,3,'2023-06-03 20:30:20',46,'Actuators adjusted the position of solar panels to track the movement of the sun throughout the day.'),(40,1,4,'2023-06-04 12:45:35',21,'Sensors in a smart washing machine detected the load size and adjusted water and detergent levels accordingly.'),(41,3,1,'2023-06-04 17:35:42',1,'Actuators controlled the movement of robotic fingers for performing delicate surgical procedures.'),(42,1,2,'2023-06-04 22:10:59',38,'The CO2 sensor detected high carbon dioxide levels and activated the ventilation system for fresh air circulation.'),(43,2,3,'2023-06-05 10:30:05',17,'Sensors in a home automation system detected an open window and activated the HVAC system to conserve energy.'),(44,3,3,'2023-06-05 15:20:12',48,'Actuators adjusted the position of a satellite antenna based on signals received from a tracking system.'),(45,3,4,'2023-06-05 19:55:28',27,'The sound sensor detected excessive noise levels and activated noise-cancelling technology.'),(46,1,1,'2023-06-06 08:10:33',0,'Sensors in a traffic management system detected vehicle presence and adjusted traffic signal timings accordingly.'),(47,3,2,'2023-06-06 12:55:40',24,'Actuators controlled the movement of a robotic snake-like arm for inspection in tight spaces.'),(48,2,3,'2023-06-06 17:30:58',20,'The light sensor detected ambient light levels and adjusted the brightness of display screens.'),(49,1,3,'2023-06-07 09:50:12',40,'Sensors in a water flow control system detected leaks and initiated valve closure to prevent further damage.'),(50,3,4,'2023-06-07 14:40:19',35,'Actuators adjusted the angle and position of solar reflectors to concentrate sunlight for energy generation.');
/*!40000 ALTER TABLE `historiek` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-22 13:11:28
