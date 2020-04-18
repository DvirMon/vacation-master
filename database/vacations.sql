-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2020 at 07:41 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations`
--

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationID` int(11) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `destination` varchar(50) NOT NULL,
  `image` varchar(100) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationID`, `description`, `destination`, `image`, `startDate`, `endDate`, `price`) VALUES
(1, 'Rome is the capital city and a special comune of Italy. Rome also serves as the capital of the Lazio region. With 2,872,800 residents in 1,285 km, it is also the countrys most populated comune. It is the fourth most populous city in the European Union by population within city limits.', 'Italy : Roma', '562c913a-4e1b-4e54-b3e2-d3087864ee88', '2020-07-12', '2020-07-31', '1700'),
(2, 'Salar de Uyuni (or Salar de Tunupa) is the worlds largest salt flat, at 10,582 square kilometers (4,086 sq mi). It is in the Daniel Campos Province in Potosí in southwest Bolivia, near the crest of the Andes at an elevation of 3,656 meters (11,995 ft) above sea level.', 'Bolivia : Salar de Uyuni', '37011c7b-ae5c-4b8c-ab7b-2c18d919286b', '2020-07-12', '2020-07-31', '1200'),
(3, 'London, the capital of England and the United Kingdom, is a 21st-century city with history stretching back to Roman times. At its centre stand the imposing Houses of Parliament, the iconic ‘Big Ben’ clock tower and Westminster Abbey, site of British monarch coronations. ', 'United Kingdom : London ', 'd18e7df2-084d-4d6b-9c89-1d6ff5dc7243', '2020-02-18', '2020-04-08', '1200'),
(4, 'Sydney is the state capital of New South Wales and the most populous city in Australia and Oceania. Located on Australia east coast, the metropolis surrounds Port Jackson and extends about 70 km', 'Sydney : Australia', 'c2608bc9-8037-4117-b455-9a569590439d', '2020-01-18', '2020-03-28', '1100'),
(5, 'Officially the highest country on Earth, lofty Nepal is commonly referred to as the \"roof of the world\" That seems like a fitting moniker for this Himalayan nation, where soaring, snow-capped mountains disappear into the clouds like stairways to heaven.', 'Nepal : Reach To Haven', 'photo-1503641926155-5c17619b79d0', '2020-07-19', '2020-07-24', '1710'),
(6, 'Mount Fuji is located on Honshū, is the highest volcano in Japan at 3,776.24 m (12,389 ft), 2nd-highest volcano of an island in Asia (after Mount Kerinci in Sumatra), and 7th-highest peak of an island in the world. It is an active stratovolcano that last erupted in 1707–1708. Mount Fuji lies about 100 kilometers (60 mi) south-west of Tokyo, and can be seen from there on a clear day. ', 'Japan : Mount Fuji', 'photo-1528164344705-47542687000d', '2020-02-04', '2020-04-13', '1200'),
(7, 'Paris is the capital and most populous city of France, with a population of 2,148,271 residents (official estimate, 1 January 2020) in an area of 105 square kilometres (41 square miles).merce, fashion, science and arts.', 'Paris:  France', 'c7d6e96a-ec58-46be-8236-31cb88f93c4d', '2018-03-11', '2018-05-11', '1200'),
(8, 'Agra is a city on the banks of the Yamuna river in the Indian state of Uttar Pradesh.[9] It is 206 kilometres (128 mi) south of the national capital New Delhi. Agra is the fourth-most populous city in Uttar Pradesh and 24th in India', 'India : Agra ', '1e0cbb49-c7e7-4679-b94d-cd2fc6d835e2', '2020-07-01', '2020-07-25', '1400'),
(9, 'Machu Picchu is a 15th-century Inca citadel, located in the Eastern Cordillera of southern Peru, on a 2,430-metre (7,970 ft) mountain ridge. It is located in the Cusco Region, Urubamba Province, Machupicchu District, above the Sacred Valley, which is 80 kilometres (50 mi) northwest of Cuzco. ', 'Peru : Explore the Ancint Maya', 'photo-1534615098829-958121bcc188', '2020-01-18', '2020-01-27', '1150'),
(10, 'Santiago, llamada también Santiago de Chile, es la capital de Chile. Es además una de las seis provincias que conforman la Región Metropolitana de Santiago. Situada a orillas del río Mapocho, Santiago fue fundada por el conquistador español Pedro de Valdivia, bajo el nombre de Santiago de Nueva Extremadura, en el siglo XVI. ', 'Chila : Santiago de Chile', 'photo-1521058798685-39dd95c33314', '2018-09-04', '2018-12-17', '1500'),
(11, 'he Carnival of Brazil is an annual Brazilian festival held between the Friday afternoon before Ash Wednesday and Ash Wednesday at noon, which marks the beginning of Lent, the forty-day period before Easter. During ', 'Brazil : Rio de Janeiro ', 'dc7b9102-d292-42c7-a04a-e43ab336f765', '2019-09-03', '2019-09-09', '1100'),
(12, 'Bagan (formerly Pagan) is an ancient city and a UNESCO World Heritage Site located in the Mandalay Region of Myanmar. From the 9th to 13th centuries, the city was the capital of the e Pagan Kingdom, the first kingdom that unified the regions that would later constitute modern Myanmar', 'Temples of Bagan : Myanmar', '14ae8fca-e80d-40eb-a892-b423ac69d326', '2020-02-18', '2020-05-21', '1500'),
(13, 'The Democratic Republic of the Congo also known as DR Congo, the DRC, DROC, Congo-Kinshasa, or simply the Congo, is a country located in Central Africa. It was formerly called Zaire (1971–1997', 'Democratic Republic of the Congo', 'photo-1579547056948-3bc828faf558', '2020-01-18', '2020-01-28', '1500'),
(14, 'The Serengeti National Park is a Tanzanian national park in the Serengeti ecosystem in the Mara and Simiyu regions. It is famous for its annual migration of over 1.5 million white-bearded (or brindled) wildebeest and 250,000 zebra and for its numerous Nile crocodile and honey badger.', 'Tanzania : Serengeti National Park ', 'b1ecaec4-01fd-45ec-8118-6a3519d380f1', '2020-07-19', '2020-07-24', '1000'),
(15, 'The Valley of the Kings also known as the Valley of the Gates of the is a valley in Egypt where, for a period of nearly 500 years from the 16th to 11th century BC, rock cut tombs were excavated for the pharaohs and powerful nobles of the New Kingdom (the Eighteenth to the Twentieth Dynasties of Ancient Egypt)', 'Egypt :  Valley of the Kings', '40d5ac7d-5516-4ca7-ac2a-4917e9924217', '2020-02-18', '2020-04-13', '1500'),
(16, 'The Forbidden City is a palace complex in central Beijing, China. It houses the Palace Museum, and was the former Chinese imperial palace from the Ming dynasty (since the Yongle Emperor) to the end of the Qing dynasty (since the Shunzhi Emperor) (the years 1420 to 1912).', 'China :  Forbidden City', '8f868cf0-96bd-4553-81a4-5348df8b5e7c', '2020-01-18', '2020-01-28', '1500'),
(17, 'Ongi Monastery (Mongolian: Онгийн хийд, Ongiin Khiid) is the collective name for the ruins of two monasteries that face each other across the Ongi River in Saikhan-Ovoo district of Dundgovi Province, in south-central Mongolia. The Barlim Monastery is located on the north bank of the river while the Khutagt Monastery sits on the south bank. The older southern complex consisted of various ', 'Mongolia : Ongiin Khiid ', '6b86b260-d6bf-440f-b27a-67bb348c7ffa', '2020-01-18', '2020-01-28', '1000'),
(18, 'San Francisco, is the cultural, commercial, and financial center of Northern California. San Francisco is the 12th-largest metropolitan statistical area in the United States by population, with 4.7 million people.', 'San Francisco : California', 'photo-1501594907352-04cda38ebc29', '2020-07-19', '2020-07-24', '1000'),
(19, 'Whether you are a hardcore adrenaline junkie, a wildlife enthusiast or a city slicker looking for cutting-edge culture, Canada ticks all the boxes.', 'Canda : Country of Maypel', 'photo-1508693926297-1d61ee3df82a', '2020-02-18', '2020-04-13', '1500'),
(20, 'Antarctica  Earth southernmost continent. It contains the geographic South Pole and is situated in the Antarctic region of the Southern Hemisphere, almost entirely south of the Antarctic Circle, and is surrounded by the Southern Ocean. At 14,200,000 square kilometres (5,500,000 square miles), it is the fifth-largest continent and nearly.', 'Antarctica : Frozen World', '0cbaf7f8-4fb1-45ee-8bf6-543cc5243a23', '2020-02-18', '2020-04-13', '3500'),
(22, 'Tierra del Fuego (Spanish for \"Land of Fire\", formerly also Fireland in English) is an archipelago off the southernmost tip of the South American mainland, across the Strait of Magellan. The archipelago consists of the main island, Isla Grande de Tierra del Fuego, with an area of 48,100 km2 (18,572 sq mi), and a group of many islands, including Cape Horn and Diego Ramírez Islands. ', 'Argentine : Fitz Roy', '26c1235f-cbaf-4990-842f-7c25db08f312', '2020-01-18', '2020-01-28', '1500'),
(23, 'Mexico City, or the City of Mexico. Nahuatl languages: Āltepētl Mēxihco), is Mexico\'s capital city, one of the 31 states which make up the 32 Federal Entities of Mexico. It is also the capital of Mexico and the most populous city in North America. Mexico City is one of the most important cultural and financial centres in the world.] It is located in the Valley of Mexico (Valle de México), a large valley in the high plateaus in the center of Mexico, at an altitude of 2,240 meters (7,350 ft). The city has 16 alcaldías, formerly known as boroughs.', 'Mecixo City : Mexico', 'photo-1512813195386-6cf811ad3542', '2020-07-19', '2020-07-24', '1100'),
(31, 'Scotland  is a country that is part of the United Kingdom. It covers the northern third of the island of Great Britain,with a border with England to the southeast, and is surrounded by the Atlantic Ocean to the north and west, the North Sea to the northeast, the Irish Sea to the south, and more than 790 islands including the Northern Isles and the Hebrides.', 'Scotland : Glasgow', '55da95ff-75da-48cc-b9e0-92448031c972', '2020-03-22', '2020-03-26', '1200'),
(32, 'Holi ( /ˈhoʊliː/) is a popular ancient Hindu festival, originating from the Indian subcontinent. It is celebrated predominantly in North India, but has also spread to other areas of Asia and parts of the Western world through the diaspora from the Indian subcontinent. Holi is popularly known as the Indian \"festival of spring\", the \"festival of colours\", or the \"festival of love\". The festival signifies the victory of good over evil', 'India ', '353ee47d-d5c1-4c88-9a87-3b8e7c418c39', '2019-08-04', '2019-09-18', '900'),
(33, 'Thailand officially the Kingdom of Thailand and formerly known as Siam is a country at the Southeast Asian Indochinese Peninsula composed of 76 provinces. Clockwise from northwest, Thailand is bordered by Myanmar, Laos, Cambodia, the Gulf of Thailand, Malaysia and the Andaman Sea. Nominally a constitutional monarchy and parliamentary democracy since 1932, the coup in 2014 established a de facto military dictatorship under a junta.', 'Thailand', 'ed928eae-7eb4-4288-89e9-96a70dddcf2d', '2020-03-17', '2020-03-18', '1000'),
(34, 'Holland is a region and former province on the western coast of the Netherlands. The name Holland is also frequently used informally to refer to the whole of the country of the Netherlands. This usage is commonly accepted in other countries, and sometimes employed by the Dutch themselves. However, some in the Netherlands, particularly those from regions outside Holland, may find it undesirable or misrepresentative to use the term for the whole country.', 'Holand ', '18d64b52-ed5e-465b-b5c9-9b9c99172999', '2020-03-01', '2020-03-28', '1300'),
(35, 'The Hobbit', 'New Zealand', '620d08bc-d2df-4b29-a519-d25bb58723c5', '2020-03-17', '2020-03-20', '1300'),
(37, 'Moscow is the capital and most populous city of Russia. With over 12.5 million residents living within the city limits of 2,511 square kilometres (970 sq mi) as of 2018, Moscow is among the worlds largest cities, being the second-most populous city in Europe, the most populous city entirely within Europe, and also the largest city (by area) on the European continent.', 'Russia : Moscow ', 'a83ec2a7-fb37-4713-bfa0-cfc185599856', '2020-03-18', '2020-03-21', '1230'),
(38, 'Kenya , is a country in Africa with 47 semiautonomous counties governed by elected governors. At 580,367 square kilometres (224,081 sq mi). Kenya capital and largest city is Nairobi, while its oldest city and first capital is the coastal city of Mombasa. Kisumu City is the third largest city and also an inland port on Lake Victoria. Other important urban centres include Nakuru and Eldoret.', 'Africa : Kenya ', '5d3ebd4d-b876-4544-9b78-329ce3ab0442', '2020-03-17', '2020-03-21', '1200'),
(39, 'We love Berlin, no matter what. That is why we will keep sending you some rays of hope and inspiration from the city of freedom in the next days and weeks. Of course, this also includes tips on current livestreams and digital offers. Many cultural institutions, Berlin artists, musicians and even sports clubs have put amazing offers online in a very short time. They are all bringing a piece of Berlin life directly into your living room. So you can discover Berlin from the couch...', 'Germany : Barlin', 'f7f8e735-4ca4-484c-b9c6-98a449e20d26', '2020-05-14', '2020-06-27', '1700'),
(48, 'New York City (NYC), often called the City of New York or simply New York (NY), is the most populous city in the United States. With an estimated 2018 population of 8,398,748 distributed over about 302.6 square miles (784 km2), New York is also the most densely populated major city in the United States.', 'New York City (NYC)', '844c9818-00c9-4b4d-823f-250ee340fada', '2020-04-02', '2020-04-21', '670'),
(49, 'The Grand Bazaar in Istanbul is one of the largest and oldest covered markets in the world, with 61 covered streets and over 4,000 shops on a total area of 30,700 m2 attracting between 250,000 and 400,000 visitors daily. In 2014, it was listed No.1 among the world most-visited tourist attractions with 91,250,000 annual visitors.The Grand Bazaar at Istanbul is often regarded as one of the first shopping malls of the world.', 'Turkey : Istanbul ', '8365b5a3-8f47-4acb-8f98-f18c113fe6ce', '2020-02-02', '2020-03-29', '1405'),
(115, 'The city of Cartagena  is a major port founded in 1533, on the northern coast of Colombia in the Caribbean Coast Region. It was strategically located between the Magdalena and Sinú rivers and became the main port for trade between Spain and its overseas empire, establishing its importance by the early 1540s.', 'Colombia : Cartagena  ', 'f5042ab0-a078-4e57-a4c1-31f618bcd013', '2020-04-05', '2020-04-12', '1200'),
(116, 'Switzerland, officially the Swiss Confederation, is a country situated in the confluence of Western, Central, and Southern Europe. It is a federal republic composed of 26 cantons, with federal authorities seated in Bern.', 'Switzerland', 'bc096ce1-748d-4839-8221-3805a6cb6112', '2020-04-19', '2020-04-22', '1300'),
(117, 'Tibet s a region in Asia covering much of the Tibetan Plateau. It is the traditional homeland of the Tibetan people as well as some other ethnic groups such as Monpa, Tamang, Qiang, Sherpa, and Lhoba peoples and is now also inhabited by considerable numbers of Han Chinese and Hui people. Tibet is the highest region on Earth, with an average elevation of 5,000 m (16,000 ft). The highest elevation in Tibet is Mount Everest, Earth highest mountain, rising 8,848 m (29,029 ft) above sea level', 'Tibet', 'd4b1837a-25a6-4c62-97fe-447bd1718771', '2020-04-13', '2020-04-18', '1400'),
(119, 'Norway  officially the Kingdom of Norway, is a Nordic country in Northwestern Europe whose territory comprises the western and northernmost portion of the Scandinavian Peninsula; the remote island of Jan Mayen and the archipelago of Svalbard are also part of the Kingdom of Norway.', 'Norway', '36c9cfcb-b708-4ec9-af42-a86ff3c11f06', '2020-04-14', '2020-04-17', '1400');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
