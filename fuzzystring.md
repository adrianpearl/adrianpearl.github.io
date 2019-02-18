---
layout: default
---

## Fuzzy String Matching with TF-IDF
##### February 2019
When you need to do 'fuzzy' string matching between two sets of strings with different formatting/spelling conventions, I recommend using TF-IDF vectorization.

***

While competing in the [Enigma Datathon](./datathon) at NYU, my team and I were analyzing a dataset of [Metrocard usage](https://public.enigma.com/datasets/new-york-mta-fare-card-usage-2010-2018/1d76b5be-ff2c-4939-b2d3-14a97e656ce3) at New York City subway stations. Our goal was to obtain the precise location of each station, and ultimately do some spatial analysis of the relationship between ridership and other spatial data, like traffic conditions around the city. We found a database of station names and coordinates, but there was no 'station ID' field that could be used to match stations from the two datasets. Our only option was to use the station names, and here's what the names from each dataset looked like:

| First Dataset (Metrocard Usage)	| Second Dataset (Station Coordinates) 	|
| --------------------------------- | ------------------------------------- |
| 8TH AVENUE-14TH STREET		 	| 14 St 								|
| LAFAYETTE AVE FULTON ST			| Lafayette Av		 					|
| NOSTRAND AVE-FULTON ST		 	| Fulton St 							|
| 81ST STREET-MUSEUM		 		| 81 St Museum of Natural History 		|
| 103RD ST-CENTRAL PARK WEST		| 103 St 								|
| VAN SICLEN AVE-PITKIN AVE		 	| Van Siclen Av 						|
| 86TH ST-CENTRAL PARK WEST		 	| 86 St 								|
| 155TH STREET-ST NICHOLAS AV		| 155 St 								|
| 34TH STREET & 8TH AVENUE		 	| 34 St Penn Station 					|
| JAY ST-METROTECH		 			| Jay St MetroTech 						|

The differences in formatting and spelling ('Av' vs 'AVE' vs 'AVENUE', etc.) make exact string matching impossible, but an even bigger problem is multiplicity. Of the hundreds of stations in New York, several are located at 34th street in some borough, and it takes some intelligence to figure out that '34TH STREET & 8TH AVENUE' corresponds to '34 St Penn Station'. Luckily, both datasets have access to the trains that stop at each station, so we appended them to the station names, adding '_TRAIN' to each one so that a matching algorithm wouldn't mistake a train number for a street number:

| First Dataset (Metrocard Usage)	| Second Dataset (Station Coordinates) 	|
| --------------------------------- | ------------------------------------- |
| 8 TH Av 14 TH STREET A_TRAIN C_TRAIN E_TRAIN L_TRAIN		 | 14 St A_TRAIN C_TRAIN E_TRAIN |
| LAFAYETTE AVE FULTON ST C_TRAIN		 | Lafayette Av C_TRAIN |
| NOSTRAND AVE FULTON ST A_TRAIN C_TRAIN	| Fulton St A_TRAIN C_TRAIN |
| 81 ST STREET MUSEUM B_TRAIN C_TRAIN		 | 81 St Museum of Natural History B_TRAIN C_TRAIN |
| 103 RD ST CENTRAL PARK WEST B_TRAIN C_TRAIN		 | 103 St B_TRAIN C_TRAIN |
| VAN SICLEN AVE PITKIN AVE C_TRAIN		 | Van Siclen Av C_TRAIN |
| 86 TH ST CENTRAL PARK WEST B_TRAIN C_TRAIN		 | 86 St B_TRAIN C_TRAIN |
| 155 TH STREET ST NICHOLAS AV C_TRAIN		 | 155 St C_TRAIN |
| 34 TH STREET & 8 TH Av A_TRAIN C_TRAIN E_TRAIN		 | 34 St Penn Station A_TRAIN C_TRAIN E_TRAIN |
| JAY ST METROTECH A_TRAIN C_TRAIN F_TRAIN		 | Jay St MetroTech A_TRAIN C_TRAIN F_TRAIN |

This improves things, because each dataset will contain only one station that is both on 34th street and serves the C train, but also leads to other problems. We tried using a few ad-hoc methods, as well as SeatGeek's [fuzzywuzzy](https://github.com/seatgeek/fuzzywuzzy) package, that tokenized the strings and searched for matches based on the number of matching tokens. But if you look at the name 'LAFAYETTE AVE FULTON ST C_TRAIN', it has more tokens in common with 'Fulton St A_TRAIN C_TRAIN' than it does with its correct match, 'Lafayette Av C_TRAIN' (3 to 2).

What we needed was a method that could incorporate all of the information, using train lines when necessary but ignoring them when more relevant information was available. In other words, we needed to **weight** the tokens according to their importance, and the best way to do this was TF-IDF vectorization. TF-IDF analyzes the corpus of words as a whole, and weights each token as more important to the string if it is less common in the corpus. This means that if two strings have a relatively rare term ('Lafayette') in common, this outweighs the importance of two more common terms ('Fulton' and 'A_TRAIN'). Below, the same strings but with the important (rare) terms highlighted:

| First Dataset (Metrocard Usage)	| Second Dataset (Station Coordinates) 	|
| --------------------------------- | ------------------------------------- |
| 8 TH Av 14 TH STREET A_TRAIN C_TRAIN E_TRAIN L_TRAIN		 | 14 St A_TRAIN C_TRAIN E_TRAIN |
| <span class='ylw'>LAFAYETTE</span> AVE FULTON ST C_TRAIN		 | <span class='ylw'>Lafayette</span> Av C_TRAIN |
| <span class='ylw'>NOSTRAND</span> AVE FULTON ST A_TRAIN C_TRAIN	| Fulton St A_TRAIN C_TRAIN |
| 81 ST STREET <span class='ylw'>MUSEUM</span> B_TRAIN C_TRAIN		 | 81 St <span class='ylw'>Museum</span> of <span class='ylw'>Natural</span> <span class='ylw'>History</span> B_TRAIN C_TRAIN |
| 103 RD ST <span class='ylw'>CENTRAL</span> PARK WEST B_TRAIN C_TRAIN		 | 103 St B_TRAIN C_TRAIN |
| <span class='ylw'>VAN</span> <span class='ylw'>SICLEN</span> AVE <span class='ylw'>PITKIN</span> AVE C_TRAIN		 | <span class='ylw'>Van</span> <span class='ylw'>Siclen</span> Av C_TRAIN |
| 86 TH ST <span class='ylw'>CENTRAL</span> PARK WEST B_TRAIN C_TRAIN		 | 86 St B_TRAIN C_TRAIN |
| 155 TH STREET ST <span class='ylw'>NICHOLAS</span> AV C_TRAIN		 | 155 St C_TRAIN |
| 34 TH STREET & 8 TH Av A_TRAIN C_TRAIN E_TRAIN		 | 34 St <span class='ylw'>Penn</span> Station A_TRAIN C_TRAIN E_TRAIN |
| <span class='ylw'>JAY</span> ST <span class='ylw'>METROTECH</span> A_TRAIN C_TRAIN F_TRAIN		 | <span class='ylw'>Jay</span> St <span class='ylw'>MetroTech</span> A_TRAIN C_TRAIN F_TRAIN |

To sum up, I had never heard of TF-IDF being used in this way, but it ended up working way better than anything else we tried. If you are ever in a similar situation, think about using it!
