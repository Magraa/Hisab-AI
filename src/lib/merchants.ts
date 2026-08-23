import type { EntityType } from "./types";

export interface KnownMerchant {
  id: string;
  name: string;
  aliases: string[];
  defaultCategoryId: string;
  entityType: EntityType;
  domain: string;
  logo: string;
  brandColor: string;
  relationship?: string;
}

function createMerchant(
  id: string,
  name: string,
  aliases: string[],
  defaultCategoryId: string,
  domain: string,
  brandColor: string,
  relationship = "Service"
): KnownMerchant {
  return {
    id,
    name,
    aliases,
    defaultCategoryId,
    entityType: "vendor",
    domain,
    logo: `/Assets/merchants/${id}.webp`,
    brandColor,
    relationship,
  };
}

export const KNOWN_MERCHANTS: KnownMerchant[] = [
  // ==========================================
  // 1. Food Delivery, Quick Commerce & Groceries (32)
  // ==========================================
  createMerchant("swiggy", "Swiggy", ["swiggy", "swigy", "swiggi", "instamart", "swiggy instamart", "swiggy dineout", "dineout"], "refreshments", "swiggy.com", "#FC8019", "Food Delivery"),
  createMerchant("zomato", "Zomato", ["zomato", "zomatto", "zomaato", "zomato gold", "zomato pro"], "refreshments", "zomato.com", "#E23744", "Food Delivery"),
  createMerchant("blinkit", "Blinkit", ["blinkit", "blink it", "grofers"], "supplies", "blinkit.com", "#F8CB46", "Quick Commerce"),
  createMerchant("zepto", "Zepto", ["zepto", "zepto cafe", "zeptocafé"], "supplies", "zeptonow.com", "#800080", "Quick Commerce"),
  createMerchant("bigbasket", "BigBasket", ["bigbasket", "big basket", "bb daily", "bb now", "bbnow", "bbdaily"], "supplies", "bigbasket.com", "#84C225", "Grocery"),
  createMerchant("dunzo", "Dunzo", ["dunzo", "dunzo daily"], "transport", "dunzo.com", "#00D290", "Delivery"),
  createMerchant("jiomart", "JioMart", ["jiomart", "jio mart"], "supplies", "jiomart.com", "#0078AD", "Grocery"),
  createMerchant("dmart", "DMart", ["dmart", "d mart", "dmart ready", "d-mart"], "supplies", "dmart.in", "#008060", "Supermarket"),
  createMerchant("countrydelight", "Country Delight", ["country delight", "countrydelight"], "supplies", "countrydelight.in", "#E31E24", "Dairy & Grocery"),
  createMerchant("licious", "Licious", ["licious"], "supplies", "licious.in", "#D11243", "Meat & Seafood"),
  createMerchant("freshtohome", "FreshToHome", ["freshtohome", "fresh to home"], "supplies", "freshtohome.com", "#0FA958", "Grocery"),
  createMerchant("naturesbasket", "Nature's Basket", ["natures basket", "nature's basket"], "supplies", "naturesbasket.co.in", "#789922", "Supermarket"),
  createMerchant("spencers", "Spencer's", ["spencers", "spencer's"], "supplies", "spencers.in", "#F37023", "Supermarket"),
  createMerchant("milkbasket", "Milkbasket", ["milkbasket", "milk basket"], "supplies", "milkbasket.com", "#20A0E0", "Grocery"),
  createMerchant("otipy", "Otipy", ["otipy"], "supplies", "otipy.com", "#4CAF50", "Fresh Produce"),
  createMerchant("moreretail", "More Retail", ["more retail", "more supermarket", "more store", "more megastore"], "supplies", "moreretail.in", "#ED1C24", "Supermarket"),
  createMerchant("starbazaar", "Star Bazaar", ["star bazaar", "star quick", "star market"], "supplies", "starbazaarindia.com", "#E31B23", "Supermarket"),
  createMerchant("patanjali", "Patanjali", ["patanjali", "patanjali store", "patanjali arogya"], "supplies", "patanjaliayurved.net", "#F47920", "Grocery & Ayurvedic"),
  createMerchant("itcstore", "ITC Store", ["itc store", "itc", "aashirvaad", "sunfeast"], "supplies", "itcstore.in", "#004B87", "Grocery"),
  createMerchant("pluckk", "Pluckk", ["pluckk"], "supplies", "pluckk.in", "#008A45", "Fresh Produce"),
  createMerchant("meatigo", "Meatigo", ["meatigo"], "supplies", "meatigo.com", "#D71921", "Meat & Seafood"),
  createMerchant("fraazo", "Fraazo", ["fraazo"], "supplies", "fraazo.com", "#2E7D32", "Fresh Produce"),
  createMerchant("dealshare", "DealShare", ["dealshare", "deal share"], "supplies", "dealshare.in", "#E91E63", "Grocery"),
  createMerchant("kisankonnect", "KisanKonnect", ["kisankonnect", "kisan konnect"], "supplies", "kisankonnect.in", "#2E7D32", "Fresh Produce"),
  createMerchant("citymall", "CityMall", ["citymall", "city mall"], "supplies", "citymall.live", "#FF5722", "Grocery"),
  createMerchant("superk", "SuperK", ["superk", "super k"], "supplies", "superk.in", "#1976D2", "Supermarket"),
  createMerchant("instacart", "Instacart", ["instacart"], "supplies", "instacart.com", "#43B02A", "Grocery Delivery"),
  createMerchant("ubereats", "Uber Eats", ["uber eats", "ubereats"], "refreshments", "ubereats.com", "#06C167", "Food Delivery"),
  createMerchant("doordash", "DoorDash", ["doordash", "door dash"], "refreshments", "doordash.com", "#FF3008", "Food Delivery"),
  createMerchant("grubhub", "Grubhub", ["grubhub"], "refreshments", "grubhub.com", "#F63440", "Food Delivery"),
  createMerchant("deliveroo", "Deliveroo", ["deliveroo"], "refreshments", "deliveroo.com", "#00CDBC", "Food Delivery"),
  createMerchant("freshippo", "Freshippo", ["freshippo", "hema"], "supplies", "freshippo.com", "#0070FF", "Supermarket"),

  // ==========================================
  // 2. Dining, Fast Food, Coffee & Cafes (45)
  // ==========================================
  createMerchant("mcdonalds", "McDonald's", ["mcdonalds", "mcdonald's", "mcd", "macdonald", "mccafé", "mccafe"], "refreshments", "mcdonaldsindia.com", "#FFBC0D", "Fast Food"),
  createMerchant("dominos", "Domino's", ["dominos", "domino's", "domino's pizza", "dominos pizza"], "refreshments", "dominos.co.in", "#006491", "Fast Food"),
  createMerchant("starbucks", "Starbucks", ["starbucks", "starbucks coffee"], "refreshments", "starbucks.in", "#006241", "Cafe"),
  createMerchant("kfc", "KFC", ["kfc", "kentucky fried chicken"], "refreshments", "kfc.co.in", "#E4002B", "Fast Food"),
  createMerchant("pizzahut", "Pizza Hut", ["pizza hut", "pizzahut"], "refreshments", "pizzahut.co.in", "#EE3124", "Fast Food"),
  createMerchant("burgerking", "Burger King", ["burger king", "burgerking"], "refreshments", "burgerking.in", "#D62300", "Fast Food"),
  createMerchant("subway", "Subway", ["subway"], "refreshments", "subway.com", "#008C15", "Fast Food"),
  createMerchant("chaipoint", "Chai Point", ["chai point", "chaipoint"], "refreshments", "chaipoint.com", "#4A2C11", "Cafe"),
  createMerchant("chaayos", "Chaayos", ["chaayos", "chayos"], "refreshments", "chaayos.com", "#00693E", "Cafe"),
  createMerchant("haldirams", "Haldiram's", ["haldiram", "haldirams", "haldiram's"], "refreshments", "haldirams.com", "#C41230", "Sweets & Dining"),
  createMerchant("bikanervala", "Bikanervala", ["bikanervala", "bikaner"], "refreshments", "bikanervala.com", "#D42E12", "Sweets & Dining"),
  createMerchant("barbequenation", "Barbeque Nation", ["barbeque nation", "barbecue nation", "bbq nation"], "refreshments", "barbequenation.com", "#F26522", "Restaurant"),
  createMerchant("bluetokai", "Blue Tokai", ["blue tokai", "bluetokai"], "refreshments", "bluetokaicoffee.com", "#0B2240", "Cafe"),
  createMerchant("thirdwave", "Third Wave Coffee", ["third wave coffee", "third wave", "twc"], "refreshments", "thirdwavecoffeeroasters.com", "#202020", "Cafe"),
  createMerchant("wowmomo", "Wow Momo", ["wow momo", "wow momos", "wow china", "wow kebab"], "refreshments", "wowmomo.com", "#FED000", "Fast Food"),
  createMerchant("costacoffee", "Costa Coffee", ["costa coffee", "costa"], "refreshments", "costacoffee.com", "#731526", "Cafe"),
  createMerchant("ccd", "Cafe Coffee Day", ["ccd", "cafe coffee day"], "refreshments", "cafecoffeeday.com", "#8A171A", "Cafe"),
  createMerchant("theobroma", "Theobroma", ["theobroma", "theo", "theobroma bakery"], "refreshments", "theobroma.in", "#402018", "Bakery & Desserts"),
  createMerchant("baskinrobbins", "Baskin Robbins", ["baskin robbins", "baskin-robbins", "br ice cream"], "refreshments", "baskinrobbinsindia.com", "#32539E", "Ice Cream"),
  createMerchant("wendys", "Wendy's", ["wendys", "wendy's"], "refreshments", "wendys.com", "#E2231A", "Fast Food"),
  createMerchant("tacobell", "Taco Bell", ["taco bell", "tacobell"], "refreshments", "tacobell.co.in", "#702082", "Fast Food"),
  createMerchant("dunkin", "Dunkin'", ["dunkin", "dunkin donuts", "dunkin'"], "refreshments", "dunkinindia.com", "#FF671F", "Cafe & Donuts"),
  createMerchant("krispykreme", "Krispy Kreme", ["krispy kreme", "krispykreme"], "refreshments", "krispykremeindia.com", "#006A4E", "Bakery & Donuts"),
  createMerchant("behrouz", "Behrouz Biryani", ["behrouz", "behrouz biryani"], "refreshments", "behrouzbiryani.com", "#9C27B0", "Biryani & Dining"),
  createMerchant("faasos", "Faasos", ["faasos", "fasos"], "refreshments", "faasos.com", "#673AB7", "Fast Food & Rolls"),
  createMerchant("ovenstory", "Ovenstory Pizza", ["ovenstory", "oven story", "ovenstory pizza"], "refreshments", "ovenstory.in", "#FF5722", "Fast Food"),
  createMerchant("biryanibykilo", "Biryani By Kilo", ["biryani by kilo", "bbk"], "refreshments", "biryanibykilo.com", "#795548", "Biryani & Dining"),
  createMerchant("madoverdonuts", "Mad Over Donuts", ["mad over donuts", "mod donuts", "m.o.d"], "refreshments", "madoverdonuts.com", "#8D6E63", "Bakery & Donuts"),
  createMerchant("naturals", "Naturals Ice Cream", ["naturals ice cream", "natural ice cream", "natural's"], "refreshments", "naturalicecreams.in", "#2E7D32", "Ice Cream"),
  createMerchant("giani", "Giani Ice Cream", ["giani", "giani ice cream"], "refreshments", "gianiicecream.in", "#D32F2F", "Ice Cream"),
  createMerchant("keventers", "Keventers", ["keventers", "keventers milkshake"], "refreshments", "keventers.com", "#1976D2", "Shakes & Desserts"),
  createMerchant("chaisuttabar", "Chai Sutta Bar", ["chai sutta bar", "csb"], "refreshments", "chaisuttabarindia.com", "#4E342E", "Cafe"),
  createMerchant("mbachaiwala", "MBA Chai Wala", ["mba chai wala", "mba chaiwala"], "refreshments", "mbachaiwala.com", "#E65100", "Cafe"),
  createMerchant("teapost", "Tea Post", ["tea post", "teapost"], "refreshments", "teapost.in", "#2E7D32", "Cafe"),
  createMerchant("golivadapav", "Goli Vada Pav", ["goli vada pav", "goli vadapav"], "refreshments", "golivadapav.com", "#F57C00", "Fast Food"),
  createMerchant("paradise", "Paradise Biryani", ["paradise biryani", "paradise food court"], "refreshments", "paradisefoodcourt.in", "#C2185B", "Restaurant"),
  createMerchant("saravanabhavan", "Saravanaa Bhavan", ["saravana bhavan", "saravanaa bhavan", "hsb"], "refreshments", "saravanabhavan.com", "#D84315", "Restaurant"),
  createMerchant("sagarratna", "Sagar Ratna", ["sagar ratna"], "refreshments", "sagarratna.in", "#E64A19", "Restaurant"),
  createMerchant("mainlandchina", "Mainland China", ["mainland china"], "refreshments", "mainlandchinaindia.com", "#B71C1C", "Restaurant"),
  createMerchant("absolutebarbecues", "Absolute Barbecues", ["absolute barbecues", "ab's", "abs barbecue"], "refreshments", "absolutebarbecues.com", "#E65100", "Restaurant"),
  createMerchant("barista", "Barista", ["barista", "barista coffee"], "refreshments", "barista.co.in", "#880E4F", "Cafe"),
  createMerchant("timhortons", "Tim Hortons", ["tim hortons", "tim horton", "tims"], "refreshments", "timhortons.com", "#C8102E", "Cafe"),
  createMerchant("nandos", "Nando's", ["nandos", "nando's"], "refreshments", "nandosindia.com", "#000000", "Restaurant"),
  createMerchant("chilis", "Chili's", ["chilis", "chili's", "chili's grill & bar"], "refreshments", "chilisindia.com", "#C62828", "Restaurant"),
  createMerchant("social", "Social Offline", ["social", "social offline", "hauz khas social", "church street social"], "refreshments", "socialoffline.in", "#212121", "Bar & Dining"),

  // ==========================================
  // 3. Cabs, Commute, Travel, Bus, Metro & Flights (36)
  // ==========================================
  createMerchant("uber", "Uber", ["uber", "uber auto", "uber cab", "uber moto", "uber trip"], "transport", "uber.com", "#000000", "Cab Service"),
  createMerchant("ola", "Ola", ["ola", "ola cab", "ola auto", "ola bike", "ola electric"], "transport", "olacabs.com", "#00C65A", "Cab Service"),
  createMerchant("rapido", "Rapido", ["rapido", "rapido bike", "rapido auto", "rapido cab"], "transport", "rapido.bike", "#F9D100", "Cab Service"),
  createMerchant("blusmart", "BluSmart", ["blusmart", "blu smart", "blusmart cab"], "transport", "myblusmart.com", "#0052FF", "EV Cabs"),
  createMerchant("irctc", "IRCTC", ["irctc", "railway", "train ticket", "tatkal", "indian railways"], "transport", "irctc.co.in", "#213D77", "Railways"),
  createMerchant("makemytrip", "MakeMyTrip", ["makemytrip", "make my trip", "mmt"], "transport", "makemytrip.com", "#E42529", "Travel Booking"),
  createMerchant("goibibo", "Goibibo", ["goibibo", "go ibibo"], "transport", "goibibo.com", "#EC5B24", "Travel Booking"),
  createMerchant("easemytrip", "EaseMyTrip", ["easemytrip", "ease my trip"], "transport", "easemytrip.com", "#1A73E8", "Travel Booking"),
  createMerchant("redbus", "RedBus", ["redbus", "red bus"], "transport", "redbus.in", "#D84E55", "Bus Booking"),
  createMerchant("abhibus", "AbhiBus", ["abhibus", "abhi bus"], "transport", "abhibus.com", "#C7222A", "Bus Booking"),
  createMerchant("indigo", "IndiGo", ["indigo", "indigo airlines", "goindigo"], "transport", "goindigo.in", "#001B94", "Airline"),
  createMerchant("airindia", "Air India", ["air india", "airindia"], "transport", "airindia.com", "#ED1C24", "Airline"),
  createMerchant("vistara", "Vistara", ["vistara", "air vistara"], "transport", "airvistara.com", "#581446", "Airline"),
  createMerchant("spicejet", "SpiceJet", ["spicejet", "spice jet"], "transport", "spicejet.com", "#ED1B24", "Airline"),
  createMerchant("akasaair", "Akasa Air", ["akasa", "akasa air"], "transport", "akasaair.com", "#FF6600", "Airline"),
  createMerchant("airindiaexpress", "Air India Express", ["air india express", "airindia express", "ix"], "transport", "airindiaexpress.com", "#F26522", "Airline"),
  createMerchant("metro", "Metro Rail", ["metro", "metro card", "delhi metro", "namma metro", "mumbai metro", "metro recharge", "hyderabad metro"], "transport", "delhimetrorail.com", "#D32F2F", "Public Transit"),
  createMerchant("oyo", "OYO", ["oyo", "oyo rooms", "oyorooms"], "transport", "oyorooms.com", "#EE2E24", "Hotels"),
  createMerchant("airbnb", "Airbnb", ["airbnb"], "transport", "airbnb.com", "#FF5A5F", "Stays & Vacation"),
  createMerchant("bookingcom", "Booking.com", ["booking.com", "bookingcom"], "transport", "booking.com", "#003580", "Hotels & Stays"),
  createMerchant("agoda", "Agoda", ["agoda"], "transport", "agoda.com", "#5392F9", "Hotels & Stays"),
  createMerchant("yatra", "Yatra", ["yatra", "yatra.com"], "transport", "yatra.com", "#EA232A", "Travel Booking"),
  createMerchant("cleartrip", "Cleartrip", ["cleartrip", "clear trip"], "transport", "cleartrip.com", "#F37023", "Travel Booking"),
  createMerchant("ixigo", "Ixigo", ["ixigo", "ixigo trains", "ixigo flights"], "transport", "ixigo.com", "#0084FF", "Travel Booking"),
  createMerchant("railyatri", "RailYatri", ["railyatri", "rail yatri"], "transport", "railyatri.in", "#1E88E5", "Travel Booking"),
  createMerchant("chalo", "Chalo", ["chalo", "chalo app", "chalo bus"], "transport", "chalo.com", "#FFD700", "Bus & Transit"),
  createMerchant("zoomcar", "Zoomcar", ["zoomcar", "zoom car"], "transport", "zoomcar.com", "#78BE20", "Car Rental"),
  createMerchant("savaari", "Savaari", ["savaari", "savaari cabs"], "transport", "savaari.com", "#2E7D32", "Car Rental"),
  createMerchant("quickride", "Quick Ride", ["quick ride", "quickride"], "transport", "quickride.in", "#00BCD4", "Carpool & Taxi"),
  createMerchant("yulu", "Yulu", ["yulu", "yulu bike", "yulu miracle"], "transport", "yulu.bike", "#00A8FF", "EV Rental"),
  createMerchant("bounce", "Bounce", ["bounce", "bounce share", "bounce infinity"], "transport", "bounceshare.com", "#E53935", "EV Rental"),
  createMerchant("zingbus", "Zingbus", ["zingbus", "zing bus"], "transport", "zingbus.com", "#00C853", "Bus Booking"),
  createMerchant("intrcity", "IntrCity SmartBus", ["intrcity", "smartbus", "intrcity smartbus"], "transport", "intrcity.com", "#0072CE", "Bus Booking"),
  createMerchant("vrltravels", "VRL Travels", ["vrl travels", "vrl bus", "vrl"], "transport", "vrlbus.in", "#D32F2F", "Bus Booking"),
  createMerchant("srstravels", "SRS Travels", ["srs travels", "srs bus"], "transport", "srsbooking.com", "#1565C0", "Bus Booking"),
  createMerchant("emirates", "Emirates", ["emirates", "emirates airlines"], "transport", "emirates.com", "#D71920", "Airline"),

  // ==========================================
  // 4. Fuel, EV Charging & Petrol Pumps (18)
  // ==========================================
  createMerchant("indianoil", "Indian Oil", ["indian oil", "iocl", "indianoil", "indane", "servo"], "fuel", "iocl.com", "#F37021", "Fuel Pump"),
  createMerchant("bpcl", "Bharat Petroleum", ["bharat petroleum", "bpcl", "speed petrol", "mak lubricants"], "fuel", "bharatpetroleum.in", "#004F9E", "Fuel Pump"),
  createMerchant("hpcl", "HPCL", ["hp petrol", "hpcl", "hindustan petroleum", "hp pump", "hp gas"], "fuel", "hindustanpetroleum.com", "#0C2340", "Fuel Pump"),
  createMerchant("shell", "Shell", ["shell", "shell petrol", "shell diesel"], "fuel", "shell.in", "#FFD500", "Fuel Pump"),
  createMerchant("jiobp", "Jio-bp", ["jio bp", "jiobp", "reliance petrol", "reliance fuel"], "fuel", "jiobp.com", "#00783C", "Fuel Pump"),
  createMerchant("nayara", "Nayara Energy", ["nayara", "nayara petrol", "nayara energy", "essar petrol"], "fuel", "nayaraenergy.com", "#E31E24", "Fuel Pump"),
  createMerchant("totalenergies", "TotalEnergies", ["total energies", "total petrol"], "fuel", "totalenergies.in", "#ED1C24", "Fuel Pump"),
  createMerchant("gulfoil", "Gulf Oil", ["gulf oil", "gulf lubricants"], "fuel", "gulfoilindia.com", "#F37023", "Lubricants & Fuel"),
  createMerchant("castrol", "Castrol", ["castrol", "castrol activ", "castrol edge"], "fuel", "castrol.com", "#009639", "Lubricants"),
  createMerchant("tatapowerev", "Tata Power EV", ["tata power ev", "tata power ez charge"], "fuel", "tatapower.com", "#005BA6", "EV Charging"),
  createMerchant("athergrid", "Ather Grid", ["ather grid", "ather charge", "ather charging"], "fuel", "atherenergy.com", "#00D290", "EV Charging"),
  createMerchant("statiq", "Statiq", ["statiq", "statiq ev"], "fuel", "statiq.in", "#00C853", "EV Charging"),
  createMerchant("chargezone", "ChargeZone", ["chargezone", "charge zone"], "fuel", "chargezone.com", "#0288D1", "EV Charging"),
  createMerchant("kazam", "Kazam EV", ["kazam", "kazam ev"], "fuel", "kazam.in", "#29B6F6", "EV Charging"),
  createMerchant("boltearth", "Bolt.Earth", ["bolt earth", "boltearth", "bolt charge"], "fuel", "bolt.earth", "#FFD600", "EV Charging"),
  createMerchant("zeoncharging", "Zeon Charging", ["zeon", "zeon charging"], "fuel", "zeoncharging.com", "#00E676", "EV Charging"),
  createMerchant("mobil", "Mobil Oil", ["mobil", "mobil 1", "mobil lubricants"], "fuel", "mobil.com", "#E31B23", "Lubricants"),
  createMerchant("valvoline", "Valvoline", ["valvoline", "valvoline cummins"], "fuel", "valvoline.com", "#004B87", "Lubricants"),

  // ==========================================
  // 5. Telecom, Broadband, Recharges & DTH (22)
  // ==========================================
  createMerchant("jio", "Jio", ["jio", "jio recharge", "jio fiber", "jiofiber", "jio airfiber", "reliance jio"], "electricity", "jio.com", "#0A2885", "Telecom"),
  createMerchant("airtel", "Airtel", ["airtel", "airtel recharge", "airtel broadband", "airtel xstream", "airtel dth", "bharti airtel", "airtel thanks"], "electricity", "airtel.in", "#E40000", "Telecom"),
  createMerchant("vi", "Vi", ["vi", "vodafone", "idea", "vi recharge", "vodafone idea"], "electricity", "myvi.in", "#ED1B24", "Telecom"),
  createMerchant("bsnl", "BSNL", ["bsnl", "bsnl recharge", "bsnl broadband"], "electricity", "bsnl.co.in", "#0054A6", "Telecom"),
  createMerchant("actfibernet", "ACT Fibernet", ["act fibernet", "act broadband", "act internet"], "electricity", "actcorp.in", "#E31E24", "Broadband"),
  createMerchant("tataplay", "Tata Play", ["tata play", "tata sky", "tataplay", "tatasky"], "electricity", "tataplay.com", "#E31837", "DTH"),
  createMerchant("dishtv", "Dish TV", ["dish tv", "dishtv", "d2h", "videocon d2h"], "electricity", "dishtv.in", "#E30613", "DTH"),
  createMerchant("sundirect", "Sun Direct", ["sun direct", "sundirect"], "electricity", "sundirect.in", "#F58220", "DTH"),
  createMerchant("hathway", "Hathway", ["hathway", "hathway broadband"], "electricity", "hathway.com", "#1F529D", "Broadband"),
  createMerchant("dennetworks", "Den Networks", ["den networks", "den broadband"], "electricity", "dennetworks.com", "#ED1C24", "Broadband & Cable"),
  createMerchant("excitel", "Excitel Broadband", ["excitel", "excitel broadband"], "electricity", "excitel.com", "#F26522", "Broadband"),
  createMerchant("spectra", "Spectra", ["spectra", "spectra broadband"], "electricity", "spectra.co", "#00AEEF", "Broadband"),
  createMerchant("siticable", "Siti Networks", ["siti cable", "siti networks", "siti broadband"], "electricity", "sitinetworks.com", "#0054A6", "Cable & Broadband"),
  createMerchant("youbroadband", "YOU Broadband", ["you broadband", "you tele"], "electricity", "youbroadband.in", "#D32F2F", "Broadband"),
  createMerchant("gtpl", "GTPL Hathway", ["gtpl", "gtpl hathway", "gtpl broadband"], "electricity", "gtpl.net", "#D32F2F", "Broadband & Cable"),
  createMerchant("asianet", "Asianet Broadband", ["asianet", "asianet broadband", "asianet dth"], "electricity", "asianetbroadband.in", "#F58220", "Broadband"),
  createMerchant("keralavision", "Kerala Vision", ["kerala vision", "keralavision"], "electricity", "keralavisionisp.com", "#0288D1", "Broadband"),
  createMerchant("tikona", "Tikona", ["tikona", "tikona broadband"], "electricity", "tikona.in", "#F58220", "Broadband"),
  createMerchant("railwire", "RailWire", ["railwire", "railwire broadband"], "electricity", "railwire.co.in", "#213D77", "Broadband"),
  createMerchant("starlink", "Starlink", ["starlink", "starlink internet"], "electricity", "starlink.com", "#000000", "Satellite Internet"),
  createMerchant("mtnl", "MTNL", ["mtnl", "mtnl dolphin", "mtnl broadband"], "electricity", "mtnl.in", "#0054A6", "Telecom"),
  createMerchant("alliancebroadband", "Alliance Broadband", ["alliance broadband", "alliance net"], "electricity", "alliancebroadband.co.in", "#0083CA", "Broadband"),

  // ==========================================
  // 6. E-Commerce, Fashion, Electronics & Home (52)
  // ==========================================
  createMerchant("amazon", "Amazon", ["amazon", "amazon pay", "amazon shopping", "amazon.in"], "supplies", "amazon.in", "#FF9900", "E-Commerce"),
  createMerchant("flipkart", "Flipkart", ["flipkart", "flipkart plus"], "supplies", "flipkart.com", "#2874F0", "E-Commerce"),
  createMerchant("myntra", "Myntra", ["myntra"], "supplies", "myntra.com", "#FF3F6C", "Fashion"),
  createMerchant("meesho", "Meesho", ["meesho"], "supplies", "meesho.com", "#84226B", "E-Commerce"),
  createMerchant("ajio", "Ajio", ["ajio", "ajio luxe"], "supplies", "ajio.com", "#2C4152", "Fashion"),
  createMerchant("nykaa", "Nykaa", ["nykaa", "nykaa man", "nykaa fashion"], "supplies", "nykaa.com", "#FC2779", "Beauty & Fashion"),
  createMerchant("tatacliq", "Tata CLiQ", ["tata cliq", "tatacliq", "tata neu", "tataneu"], "supplies", "tatacliq.com", "#1F1F1F", "E-Commerce"),
  createMerchant("urbancompany", "Urban Company", ["urban company", "urban clap", "urbanclap", "uc salon"], "maintenance", "urbancompany.com", "#000000", "Home Services"),
  createMerchant("ikea", "IKEA", ["ikea"], "supplies", "ikea.com", "#0058A3", "Furniture & Home"),
  createMerchant("decathlon", "Decathlon", ["decathlon"], "supplies", "decathlon.in", "#0082C3", "Sports"),
  createMerchant("zara", "Zara", ["zara"], "supplies", "zara.com", "#000000", "Fashion"),
  createMerchant("hm", "H&M", ["hm", "h&m", "h and m"], "supplies", "hm.com", "#CD040B", "Fashion"),
  createMerchant("uniqlo", "Uniqlo", ["uniqlo"], "supplies", "uniqlo.com", "#FF0000", "Fashion"),
  createMerchant("purplle", "Purplle", ["purplle"], "supplies", "purplle.com", "#7B1FA2", "Beauty"),
  createMerchant("croma", "Croma", ["croma", "croma electronics"], "supplies", "croma.com", "#00A5A8", "Electronics"),
  createMerchant("reliancedigital", "Reliance Digital", ["reliance digital", "resq"], "supplies", "reliancedigital.in", "#E42529", "Electronics"),
  createMerchant("vijaysales", "Vijay Sales", ["vijay sales"], "supplies", "vijaysales.com", "#D32F2F", "Electronics"),
  createMerchant("poorvika", "Poorvika", ["poorvika", "poorvika mobiles"], "supplies", "poorvika.com", "#FF9900", "Electronics"),
  createMerchant("pepperfry", "Pepperfry", ["pepperfry"], "supplies", "pepperfry.com", "#F26522", "Furniture"),
  createMerchant("urbanladder", "Urban Ladder", ["urban ladder", "urbanladder"], "supplies", "urbanladder.com", "#F37023", "Furniture"),
  createMerchant("wakefit", "Wakefit", ["wakefit", "wakefit mattress"], "supplies", "wakefit.co", "#0052CC", "Home & Sleep"),
  createMerchant("sleepwell", "Sleepwell", ["sleepwell", "sleepwell mattress"], "supplies", "mysleepwell.com", "#1976D2", "Home & Sleep"),
  createMerchant("lenskart", "Lenskart", ["lenskart", "john jacobs", "vincent chase"], "supplies", "lenskart.com", "#000042", "Eyewear"),
  createMerchant("titan", "Titan", ["titan", "titan world", "titan eyeplus", "skinn"], "supplies", "titan.co.in", "#000000", "Watches & Accessories"),
  createMerchant("fastrack", "Fastrack", ["fastrack"], "supplies", "fastrack.in", "#000000", "Watches & Accessories"),
  createMerchant("tanishq", "Tanishq", ["tanishq", "tanishq jewellery", "mia by tanishq"], "supplies", "tanishq.co.in", "#8B1E41", "Jewellery"),
  createMerchant("caratlane", "CaratLane", ["caratlane", "carat lane"], "supplies", "caratlane.com", "#652D90", "Jewellery"),
  createMerchant("kalyanjewellers", "Kalyan Jewellers", ["kalyan jewellers", "kalyan"], "supplies", "kalyanjewellers.net", "#9C27B0", "Jewellery"),
  createMerchant("bluestone", "BlueStone", ["bluestone", "blue stone"], "supplies", "bluestone.com", "#1565C0", "Jewellery"),
  createMerchant("fabindia", "Fabindia", ["fabindia", "fab india"], "supplies", "fabindia.com", "#8B1E41", "Fashion & Home"),
  createMerchant("manyavar", "Manyavar", ["manyavar", "mohey"], "supplies", "manyavar.com", "#9C27B0", "Ethnic Wear"),
  createMerchant("peterengland", "Peter England", ["peter england"], "supplies", "peterengland.abfrl.in", "#8B1E41", "Fashion"),
  createMerchant("allensolly", "Allen Solly", ["allen solly"], "supplies", "allensolly.abfrl.in", "#004B87", "Fashion"),
  createMerchant("vanheusen", "Van Heusen", ["van heusen"], "supplies", "vanheusenindia.abfrl.in", "#000000", "Fashion"),
  createMerchant("louisphilippe", "Louis Philippe", ["louis philippe"], "supplies", "louisphilippe.abfrl.in", "#8B1E41", "Fashion"),
  createMerchant("levis", "Levi's", ["levis", "levi's"], "supplies", "levi.in", "#C41230", "Fashion"),
  createMerchant("woodland", "Woodland", ["woodland", "woodland shoes"], "supplies", "woodlandworldwide.com", "#2E7D32", "Footwear & Outdoor"),
  createMerchant("bata", "Bata", ["bata", "bata shoes", "hush puppies", "power shoes"], "supplies", "bata.in", "#D32F2F", "Footwear"),
  createMerchant("metroshoes", "Metro Shoes", ["metro shoes", "mochi", "mochi shoes"], "supplies", "metroshoes.com", "#D32F2F", "Footwear"),
  createMerchant("campus", "Campus Shoes", ["campus", "campus shoes"], "supplies", "campusshoes.com", "#0D47A1", "Footwear"),
  createMerchant("skechers", "Skechers", ["skechers"], "supplies", "skechers.in", "#002B49", "Footwear & Sports"),
  createMerchant("nike", "Nike", ["nike", "nike store"], "supplies", "nike.com", "#000000", "Sportswear"),
  createMerchant("adidas", "Adidas", ["adidas", "adidas originals"], "supplies", "adidas.co.in", "#000000", "Sportswear"),
  createMerchant("puma", "Puma", ["puma", "puma store"], "supplies", "in.puma.com", "#000000", "Sportswear"),
  createMerchant("reebok", "Reebok", ["reebok"], "supplies", "reebok.abfrl.in", "#E31B23", "Sportswear"),
  createMerchant("wildcraft", "Wildcraft", ["wildcraft"], "supplies", "wildcraft.com", "#F37023", "Outdoor & Bags"),
  createMerchant("vipluggage", "VIP Bags", ["vip bags", "vip luggage", "aristocrat", "skybags"], "supplies", "vipbags.com", "#D32F2F", "Luggage & Bags"),
  createMerchant("american-tourister", "American Tourister", ["american tourister", "kamiliant"], "supplies", "americantourister.in", "#FFD200", "Luggage"),
  createMerchant("boat", "boAt", ["boat", "boat audio", "boat lifestyle", "boat earphones", "boat watch"], "supplies", "boat-lifestyle.com", "#FF0000", "Electronics & Audio"),
  createMerchant("noise", "Noise", ["noise", "gonoise", "noise watch"], "supplies", "gonoise.com", "#1976D2", "Wearables & Audio"),
  createMerchant("fireboltt", "Fire-Boltt", ["fire-boltt", "fireboltt"], "supplies", "fireboltt.com", "#FF3D00", "Smartwatches"),
  createMerchant("jbl", "JBL", ["jbl", "jbl audio", "jbl speakers"], "supplies", "jbl.com", "#FF5500", "Audio"),

  // ==========================================
  // 7. Entertainment, OTT, Movies, Gaming & Media (36)
  // ==========================================
  createMerchant("netflix", "Netflix", ["netflix", "netflix subscription"], "other", "netflix.com", "#E50914", "Streaming"),
  createMerchant("spotify", "Spotify", ["spotify", "spotify premium"], "other", "spotify.com", "#1DB954", "Music"),
  createMerchant("youtube", "YouTube", ["youtube", "youtube premium", "yt premium", "youtube music"], "other", "youtube.com", "#FF0000", "Video & Music"),
  createMerchant("hotstar", "Disney+ Hotstar", ["hotstar", "disney hotstar", "disney+ hotstar"], "other", "hotstar.com", "#123B96", "Streaming"),
  createMerchant("primevideo", "Prime Video", ["prime video", "amazon prime video", "amazon prime"], "other", "primevideo.com", "#00A8E1", "Streaming"),
  createMerchant("bookmyshow", "BookMyShow", ["bookmyshow", "book my show", "bms"], "refreshments", "bookmyshow.com", "#EB1536", "Entertainment"),
  createMerchant("pvr", "PVR INOX", ["pvr", "inox", "pvr cinemas", "pvr inox"], "refreshments", "pvrcinemas.com", "#E5B23B", "Cinema"),
  createMerchant("apple", "Apple", ["apple", "apple music", "icloud", "apple tv", "app store"], "other", "apple.com", "#000000", "Tech & Subscriptions"),
  createMerchant("sonyliv", "Sony LIV", ["sonyliv", "sony liv"], "other", "sonyliv.com", "#202020", "Streaming"),
  createMerchant("zee5", "ZEE5", ["zee5", "zee 5"], "other", "zee5.com", "#8230C6", "Streaming"),
  createMerchant("jiocinema", "JioCinema", ["jiocinema", "jio cinema"], "other", "jiocinema.com", "#D80064", "Streaming"),
  createMerchant("audible", "Audible", ["audible"], "other", "audible.in", "#F8991C", "Audiobooks"),
  createMerchant("sunnxt", "Sun NXT", ["sun nxt", "sunnxt"], "other", "sunnxt.net", "#F58220", "Streaming"),
  createMerchant("aha", "Aha Video", ["aha", "aha video", "aha ott"], "other", "aha.video", "#FF3D00", "Streaming"),
  createMerchant("hoichoi", "Hoichoi", ["hoichoi"], "other", "hoichoi.tv", "#E50914", "Streaming"),
  createMerchant("lionsgateplay", "Lionsgate Play", ["lionsgate", "lionsgate play"], "other", "lionsgateplay.com", "#D4AF37", "Streaming"),
  createMerchant("discoveryplus", "Discovery+", ["discovery+", "discovery plus"], "other", "discoveryplus.in", "#003A70", "Streaming"),
  createMerchant("mxplayer", "MX Player", ["mx player", "mxplayer"], "other", "mxplayer.in", "#0066FF", "Streaming"),
  createMerchant("jiosaavn", "JioSaavn", ["jiosaavn", "jio saavn", "saavn"], "other", "jiosaavn.com", "#2BC5B4", "Music"),
  createMerchant("gaana", "Gaana", ["gaana", "gaana plus"], "other", "gaana.com", "#E72C30", "Music"),
  createMerchant("wynk", "Wynk Music", ["wynk", "wynk music"], "other", "wynk.in", "#E40000", "Music"),
  createMerchant("pocketfm", "Pocket FM", ["pocket fm", "pocketfm"], "other", "pocketfm.com", "#FF5722", "Audiobooks & Stories"),
  createMerchant("kukufm", "Kuku FM", ["kuku fm", "kukufm"], "other", "kukufm.com", "#FF3B30", "Audiobooks & Podcasts"),
  createMerchant("storytel", "Storytel", ["storytel"], "other", "storytel.com", "#FF6F00", "Audiobooks"),
  createMerchant("steam", "Steam", ["steam", "steam game", "steam wallet"], "other", "steampowered.com", "#171A21", "Gaming"),
  createMerchant("playstation", "PlayStation", ["playstation", "ps plus", "ps store", "psn"], "other", "playstation.com", "#003791", "Gaming"),
  createMerchant("xbox", "Xbox", ["xbox", "xbox game pass", "microsoft store game"], "other", "xbox.com", "#107C10", "Gaming"),
  createMerchant("epicgames", "Epic Games", ["epic games", "fortnite", "unreal"], "other", "epicgames.com", "#313131", "Gaming"),
  createMerchant("dream11", "Dream11", ["dream11", "dream 11"], "other", "dream11.com", "#E41B23", "Gaming & Fantasy"),
  createMerchant("my11circle", "My11Circle", ["my11circle", "my 11 circle"], "other", "my11circle.com", "#2E7D32", "Gaming & Fantasy"),
  createMerchant("mpl", "MPL", ["mpl", "mobile premier league"], "other", "mpl.live", "#D32F2F", "Gaming"),
  createMerchant("winzo", "WinZO", ["winzo", "winzo games"], "other", "winzogames.com", "#FF9800", "Gaming"),
  createMerchant("cricbuzz", "Cricbuzz", ["cricbuzz", "cricbuzz plus"], "other", "cricbuzz.com", "#009270", "Sports & Media"),
  createMerchant("nintendo", "Nintendo", ["nintendo", "nintendo eshop", "nintendo switch"], "other", "nintendo.com", "#E60012", "Gaming"),
  createMerchant("riotgames", "Riot Games", ["riot games", "valorant", "league of legends"], "other", "riotgames.com", "#D32936", "Gaming"),
  createMerchant("bgmi", "BGMI", ["bgmi", "battlegrounds mobile india", "krafton"], "other", "battlegroundsmobileindia.com", "#FF5722", "Gaming"),

  // ==========================================
  // 8. Payments, Wallets, Banking & Investments (38)
  // ==========================================
  createMerchant("googlepay", "Google Pay", ["google pay", "gpay", "g-pay", "googlepay"], "other", "pay.google.com", "#4285F4", "Payments"),
  createMerchant("phonepe", "PhonePe", ["phonepe", "phone pe", "phonepay"], "other", "phonepe.com", "#5F259F", "Payments"),
  createMerchant("paytm", "Paytm", ["paytm", "paytm mall", "paytm postpaid"], "other", "paytm.com", "#00BAF2", "Payments"),
  createMerchant("cred", "CRED", ["cred", "cred pay", "cred rent", "cred garage"], "other", "cred.club", "#1A1A1A", "Fintech"),
  createMerchant("zerodha", "Zerodha", ["zerodha", "kite", "kite zerodha", "coin by zerodha"], "other", "zerodha.com", "#387ED1", "Broker"),
  createMerchant("groww", "Groww", ["groww", "groww app"], "other", "groww.in", "#00D09C", "Broker"),
  createMerchant("upstox", "Upstox", ["upstox", "rksv"], "other", "upstox.com", "#5D2E8C", "Broker"),
  createMerchant("angelone", "Angel One", ["angel one", "angel broking"], "other", "angelone.in", "#F58220", "Broker"),
  createMerchant("5paisa", "5paisa", ["5paisa", "5 paisa"], "other", "5paisa.com", "#E53935", "Broker"),
  createMerchant("dhan", "Dhan", ["dhan", "dhan app"], "other", "dhan.co", "#00D09C", "Broker"),
  createMerchant("indmoney", "INDmoney", ["indmoney", "ind money"], "other", "indmoney.com", "#1976D2", "Fintech"),
  createMerchant("smallcase", "Smallcase", ["smallcase"], "other", "smallcase.com", "#2E7D32", "Investments"),
  createMerchant("hdfc", "HDFC Bank", ["hdfc", "hdfc bank", "hdfc credit card", "hdfc netbanking", "payzapp"], "other", "hdfcbank.com", "#004C8F", "Bank"),
  createMerchant("icici", "ICICI Bank", ["icici", "icici bank", "icici credit card", "imobile", "icici direct"], "other", "icicibank.com", "#F58220", "Bank"),
  createMerchant("sbi", "State Bank of India", ["sbi", "state bank of india", "yono", "yono sbi", "sbi card"], "other", "sbi.co.in", "#280071", "Bank"),
  createMerchant("axisbank", "Axis Bank", ["axis", "axis bank", "axis credit card", "freecharge"], "other", "axisbank.com", "#97144D", "Bank"),
  createMerchant("kotak", "Kotak Mahindra Bank", ["kotak", "kotak bank", "kotak 811", "kotak cherry"], "other", "kotak.com", "#ED1C24", "Bank"),
  createMerchant("pnb", "Punjab National Bank", ["pnb", "punjab national bank"], "other", "pnbindia.in", "#A20034", "Bank"),
  createMerchant("bob", "Bank of Baroda", ["bob", "bank of baroda", "bob world"], "other", "bankofbaroda.in", "#F26522", "Bank"),
  createMerchant("indusind", "IndusInd Bank", ["indusind", "indusind bank"], "other", "indusind.com", "#8B1E41", "Bank"),
  createMerchant("yesbank", "Yes Bank", ["yes bank", "yesbank"], "other", "yesbank.in", "#005BA6", "Bank"),
  createMerchant("idfcfirst", "IDFC FIRST Bank", ["idfc", "idfc first", "idfc first bank"], "other", "idfcfirstbank.com", "#9E1B32", "Bank"),
  createMerchant("federalbank", "Federal Bank", ["federal bank", "fedmobile"], "other", "federalbank.co.in", "#003A70", "Bank"),
  createMerchant("rblbank", "RBL Bank", ["rbl", "rbl bank", "rbl credit card"], "other", "rblbank.com", "#002B49", "Bank"),
  createMerchant("aubank", "AU Small Finance Bank", ["au bank", "au small finance bank"], "other", "aubank.in", "#6B1D73", "Bank"),
  createMerchant("slice", "Slice", ["slice", "slice card", "slice pay"], "other", "sliceit.com", "#800080", "Fintech"),
  createMerchant("onecard", "OneCard", ["onecard", "one card", "fpl"], "other", "getonecard.app", "#000000", "Credit Card"),
  createMerchant("jupiter", "Jupiter Money", ["jupiter", "jupiter money"], "other", "jupiter.money", "#FF6B6B", "Neobank"),
  createMerchant("fimoney", "Fi Money", ["fi money", "fi bank"], "other", "fi.money", "#00D09C", "Neobank"),
  createMerchant("mobikwik", "MobiKwik", ["mobikwik", "zip pay later"], "other", "mobikwik.com", "#00A5EC", "Wallet & Payments"),
  createMerchant("bharatpe", "BharatPe", ["bharatpe", "bharat pe", "postpe"], "other", "bharatpe.com", "#007AFF", "Fintech"),
  createMerchant("razorpay", "Razorpay", ["razorpay", "razorpayx"], "other", "razorpay.com", "#0C2340", "Payments"),
  createMerchant("pinelabs", "Pine Labs", ["pine labs", "pinelabs", "qwikcilver"], "other", "pinelabs.com", "#00A859", "Fintech"),
  createMerchant("policybazaar", "PolicyBazaar", ["policybazaar", "policy bazaar", "pb fintech"], "other", "policybazaar.com", "#0A3370", "Insurance"),
  createMerchant("acko", "Acko General Insurance", ["acko", "acko insurance"], "other", "acko.com", "#5E2590", "Insurance"),
  createMerchant("digit", "Digit Insurance", ["digit insurance", "godigit"], "other", "godigit.com", "#FF7900", "Insurance"),
  createMerchant("bajajfinserv", "Bajaj Finserv", ["bajaj finserv", "bajaj finance", "bajaj emi card"], "other", "bajajfinserv.in", "#0072CE", "Lending & Finance"),
  createMerchant("muthoot", "Muthoot Finance", ["muthoot", "muthoot finance", "muthoot gold loan"], "other", "muthootfinance.com", "#C8102E", "Finance"),

  // ==========================================
  // 9. Healthcare, Pharmacy & Fitness (26)
  // ==========================================
  createMerchant("apollo", "Apollo Pharmacy", ["apollo", "apollo pharmacy", "apollo 247", "apollo hospital"], "supplies", "apollo247.com", "#007799", "Healthcare"),
  createMerchant("1mg", "Tata 1mg", ["1mg", "tata 1mg", "tata1mg", "1 mg"], "supplies", "1mg.com", "#FF6F61", "Pharmacy"),
  createMerchant("pharmeasy", "PharmEasy", ["pharmeasy", "pharm easy"], "supplies", "pharmeasy.in", "#10847E", "Pharmacy"),
  createMerchant("netmeds", "Netmeds", ["netmeds"], "supplies", "netmeds.com", "#24AEB1", "Pharmacy"),
  createMerchant("practo", "Practo", ["practo"], "maintenance", "practo.com", "#14BEF0", "Healthcare"),
  createMerchant("cultfit", "Cult.fit", ["cult fit", "cult.fit", "curefit", "cultfit", "cult pass"], "other", "cult.fit", "#FF3278", "Fitness"),
  createMerchant("lalpathlabs", "Dr Lal PathLabs", ["dr lal pathlabs", "lal pathlabs", "lal path lab"], "maintenance", "lalpathlabs.com", "#FFD700", "Diagnostics"),
  createMerchant("medplus", "MedPlus", ["medplus", "medplus mart"], "supplies", "medplusmart.com", "#E31E24", "Pharmacy"),
  createMerchant("metropolis", "Metropolis Healthcare", ["metropolis", "metropolis labs", "metropolis healthcare"], "maintenance", "metropolisindia.com", "#005BA6", "Diagnostics"),
  createMerchant("thyrocare", "Thyrocare", ["thyrocare", "thyrocare labs", "aarogyam"], "maintenance", "thyrocare.com", "#006699", "Diagnostics"),
  createMerchant("srl", "SRL Diagnostics", ["srl diagnostics", "srl labs", "agilus diagnostics", "agilus"], "maintenance", "agilusdiagnostics.com", "#0083CA", "Diagnostics"),
  createMerchant("maxhealthcare", "Max Healthcare", ["max hospital", "max healthcare"], "maintenance", "maxhealthcare.in", "#005BA6", "Hospital"),
  createMerchant("fortis", "Fortis Healthcare", ["fortis", "fortis hospital", "fortis healthcare"], "maintenance", "fortishealthcare.com", "#009639", "Hospital"),
  createMerchant("manipal", "Manipal Hospitals", ["manipal hospital", "manipal hospitals"], "maintenance", "manipalhospitals.com", "#0054A6", "Hospital"),
  createMerchant("narayana", "Narayana Health", ["narayana health", "narayana hrudayalaya"], "maintenance", "narayanahealth.org", "#E31B23", "Hospital"),
  createMerchant("medanta", "Medanta", ["medanta", "medanta the medicity", "medanta hospital"], "maintenance", "medanta.org", "#007A3D", "Hospital"),
  createMerchant("cloudnine", "Cloudnine Hospitals", ["cloudnine", "cloud nine", "cloudnine hospital"], "maintenance", "cloudninecare.com", "#EC008C", "Maternity & Care"),
  createMerchant("healthifyme", "HealthifyMe", ["healthifyme", "healthify", "healthifyme pro"], "other", "healthifyme.com", "#2E7D32", "Health & Fitness"),
  createMerchant("fittr", "Fittr", ["fittr", "fittr app"], "other", "fittr.com", "#FF5722", "Fitness"),
  createMerchant("goldsgym", "Gold's Gym", ["golds gym", "gold's gym"], "other", "goldsgym.in", "#FFC72C", "Gym & Fitness"),
  createMerchant("anytimefitness", "Anytime Fitness", ["anytime fitness"], "other", "anytimefitness.co.in", "#4C12A1", "Gym & Fitness"),
  createMerchant("truemeds", "Truemeds", ["truemeds", "true meds"], "supplies", "truemeds.in", "#1976D2", "Pharmacy"),
  createMerchant("dawaadost", "Dawaa Dost", ["dawaa dost", "dawaadost"], "supplies", "dawaadost.com", "#2E7D32", "Generic Medicine"),
  createMerchant("frankross", "Frank Ross Pharmacy", ["frank ross", "frank ross pharmacy"], "supplies", "frankrosspharmacy.com", "#D32F2F", "Pharmacy"),
  createMerchant("wellnessforever", "Wellness Forever", ["wellness forever", "wellness forever pharmacy"], "supplies", "wellnessforever.com", "#00A651", "Pharmacy"),
  createMerchant("asterdm", "Aster DM Healthcare", ["aster", "aster hospital", "aster medcity"], "maintenance", "asterhospitals.in", "#0072CE", "Hospital"),

  // ==========================================
  // 10. Software, AI, Cloud, Hosting & Productivity (50)
  // ==========================================
  createMerchant("openai", "ChatGPT / OpenAI", ["chatgpt", "chat gpt", "openai", "chatgpt plus"], "other", "openai.com", "#10A37F", "AI Subscription"),
  createMerchant("google", "Google Cloud / One", ["google storage", "google one", "google workspace", "google cloud", "gsuite"], "other", "google.com", "#4285F4", "Cloud & Software"),
  createMerchant("microsoft", "Microsoft 365", ["microsoft", "office 365", "ms office", "microsoft 365", "onedrive", "azure"], "other", "microsoft.com", "#00A4EF", "Software"),
  createMerchant("canva", "Canva", ["canva", "canva pro"], "other", "canva.com", "#00C4CC", "Design Tool"),
  createMerchant("adobe", "Adobe", ["adobe", "creative cloud", "photoshop", "adobe cc"], "other", "adobe.com", "#FF0000", "Design Software"),
  createMerchant("github", "GitHub", ["github", "github copilot", "copilot"], "other", "github.com", "#181717", "Developer Tool"),
  createMerchant("notion", "Notion", ["notion", "notion plus", "notion ai"], "other", "notion.so", "#000000", "Productivity"),
  createMerchant("claude", "Claude / Anthropic", ["claude", "claude ai", "anthropic", "claude pro"], "other", "anthropic.com", "#D97706", "AI Subscription"),
  createMerchant("zoom", "Zoom", ["zoom", "zoom pro", "zoom meeting"], "other", "zoom.us", "#2D8CFF", "Video Conferencing"),
  createMerchant("linkedin", "LinkedIn", ["linkedin", "linkedin premium", "linkedin learning"], "other", "linkedin.com", "#0A66C2", "Professional Network"),
  createMerchant("hostinger", "Hostinger", ["hostinger"], "other", "hostinger.com", "#673DE6", "Web Hosting"),
  createMerchant("godaddy", "GoDaddy", ["godaddy", "go daddy"], "other", "godaddy.com", "#1BDBDB", "Domain & Hosting"),
  createMerchant("figma", "Figma", ["figma", "figma pro"], "other", "figma.com", "#F24E1E", "Design Tool"),
  createMerchant("namecheap", "Namecheap", ["namecheap"], "other", "namecheap.com", "#DE3723", "Domain & Hosting"),
  createMerchant("bluehost", "Bluehost", ["bluehost"], "other", "bluehost.com", "#1967D2", "Web Hosting"),
  createMerchant("aws", "Amazon Web Services", ["aws", "amazon web services", "amazon ec2", "aws cloud"], "other", "aws.amazon.com", "#FF9900", "Cloud Infrastructure"),
  createMerchant("digitalocean", "DigitalOcean", ["digitalocean", "digital ocean", "droplet"], "other", "digitalocean.com", "#0080FF", "Cloud Infrastructure"),
  createMerchant("vercel", "Vercel", ["vercel", "vercel pro"], "other", "vercel.com", "#000000", "Cloud Platform"),
  createMerchant("netlify", "Netlify", ["netlify"], "other", "netlify.com", "#00C7B7", "Cloud Platform"),
  createMerchant("cloudflare", "Cloudflare", ["cloudflare", "cloudflare pro"], "other", "cloudflare.com", "#F38020", "Cloud & Security"),
  createMerchant("heroku", "Heroku", ["heroku"], "other", "heroku.com", "#430098", "Cloud Platform"),
  createMerchant("cursor", "Cursor AI", ["cursor", "cursor ai", "cursor ide"], "other", "cursor.com", "#000000", "AI Developer Tool"),
  createMerchant("replit", "Replit", ["replit", "replit core"], "other", "replit.com", "#F26207", "Developer Tool"),
  createMerchant("midjourney", "Midjourney", ["midjourney", "mid journey"], "other", "midjourney.com", "#000000", "AI Image Generator"),
  createMerchant("perplexity", "Perplexity AI", ["perplexity", "perplexity ai", "perplexity pro"], "other", "perplexity.ai", "#1FB8CD", "AI Search"),
  createMerchant("grammarly", "Grammarly", ["grammarly", "grammarly premium"], "other", "grammarly.com", "#15C39A", "Productivity"),
  createMerchant("deepl", "DeepL", ["deepl", "deepl pro"], "other", "deepl.com", "#0F2B46", "Translation AI"),
  createMerchant("duolingo", "Duolingo", ["duolingo", "duolingo super", "duolingo max"], "other", "duolingo.com", "#58CC02", "Education"),
  createMerchant("coursera", "Coursera", ["coursera", "coursera plus"], "other", "coursera.org", "#0056D2", "Education"),
  createMerchant("udemy", "Udemy", ["udemy"], "other", "udemy.com", "#A435F0", "Education"),
  createMerchant("unacademy", "Unacademy", ["unacademy", "unacademy plus"], "other", "unacademy.com", "#08BD80", "Education"),
  createMerchant("physicswallah", "PhysicsWallah", ["physics wallah", "physicswallah", "pw app"], "other", "pw.live", "#5A4BDA", "Education"),
  createMerchant("byjus", "BYJU'S", ["byjus", "byju's"], "other", "byjus.com", "#813588", "Education"),
  createMerchant("simplilearn", "Simplilearn", ["simplilearn"], "other", "simplilearn.com", "#009688", "Education"),
  createMerchant("upgrad", "upGrad", ["upgrad"], "other", "upgrad.com", "#E41B23", "Education"),
  createMerchant("geeksforgeeks", "GeeksforGeeks", ["geeksforgeeks", "gfg"], "other", "geeksforgeeks.org", "#2F8D46", "Coding & Education"),
  createMerchant("leetcode", "LeetCode", ["leetcode", "leetcode premium"], "other", "leetcode.com", "#FFA116", "Coding Platform"),
  createMerchant("jetbrains", "JetBrains", ["jetbrains", "intellij", "pycharm", "webstorm"], "other", "jetbrains.com", "#000000", "Developer Tools"),
  createMerchant("atlassian", "Atlassian", ["jira", "confluence", "trello", "atlassian"], "other", "atlassian.com", "#0052CC", "Productivity"),
  createMerchant("miro", "Miro", ["miro", "miro board"], "other", "miro.com", "#FFD02F", "Whiteboard & Design"),
  createMerchant("asana", "Asana", ["asana"], "other", "asana.com", "#F06A6A", "Project Management"),
  createMerchant("monday", "Monday.com", ["monday.com", "monday"], "other", "monday.com", "#6161FF", "Project Management"),
  createMerchant("clickup", "ClickUp", ["clickup", "click up"], "other", "clickup.com", "#7B68EE", "Project Management"),
  createMerchant("airtable", "Airtable", ["airtable"], "other", "airtable.com", "#FCB400", "Productivity"),
  createMerchant("zapier", "Zapier", ["zapier"], "other", "zapier.com", "#FF4A00", "Automation"),
  createMerchant("shopify", "Shopify", ["shopify"], "other", "shopify.com", "#96BF48", "E-Commerce Platform"),
  createMerchant("webflow", "Webflow", ["webflow"], "other", "webflow.com", "#4353FF", "Web Design"),
  createMerchant("wordpress", "WordPress", ["wordpress", "wp engine"], "other", "wordpress.com", "#21759B", "CMS & Hosting"),
  createMerchant("wix", "Wix", ["wix", "wix.com"], "other", "wix.com", "#0C6EFC", "Website Builder"),
  createMerchant("mailchimp", "Mailchimp", ["mailchimp"], "other", "mailchimp.com", "#FFE01B", "Email Marketing"),
  createMerchant("brevo", "Brevo", ["brevo", "sendinblue"], "other", "brevo.com", "#0B996F", "Email Marketing"),
  createMerchant("stripe", "Stripe", ["stripe"], "other", "stripe.com", "#635BFF", "Payments Infrastructure"),
  createMerchant("postman", "Postman", ["postman", "postman pro"], "other", "postman.com", "#FF6C37", "API Development"),
  createMerchant("sentry", "Sentry", ["sentry", "sentry.io"], "other", "sentry.io", "#362D59", "Developer Tool"),
  createMerchant("supabase", "Supabase", ["supabase", "supabase pro"], "other", "supabase.com", "#3ECF8E", "Database & Cloud"),
];

/**
 * Searches the curated merchant dictionary for matching aliases or keywords.
 * Checks whole-word or substring boundaries with longest-match priority.
 */
export function findMerchant(text: string): KnownMerchant | undefined {
  if (!text) return undefined;
  const lower = text.trim().toLowerCase();

  let bestMatch: KnownMerchant | undefined;
  let longestAliasLength = 0;

  for (const merchant of KNOWN_MERCHANTS) {
    for (const alias of merchant.aliases) {
      const a = alias.toLowerCase();
      // Match exact or as word in string
      const regex = new RegExp(`\\b${escapeRegex(a)}\\b`, "i");
      if (regex.test(lower) || lower === a) {
        if (a.length > longestAliasLength) {
          bestMatch = merchant;
          longestAliasLength = a.length;
        }
      }
    }
  }

  // Fallback: Check if merchant name itself matches as substring if length >= 3
  if (!bestMatch) {
    for (const merchant of KNOWN_MERCHANTS) {
      const mName = merchant.name.toLowerCase();
      if (mName.length >= 3 && lower.includes(mName) && mName.length > longestAliasLength) {
        bestMatch = merchant;
        longestAliasLength = mName.length;
      }
    }
  }

  return bestMatch;
}

export function getMerchantByName(name: string): KnownMerchant | undefined {
  if (!name) return undefined;
  const lower = name.trim().toLowerCase();
  return (
    KNOWN_MERCHANTS.find((m) => m.name.toLowerCase() === lower) ||
    KNOWN_MERCHANTS.find((m) => m.aliases.some((a) => a.toLowerCase() === lower))
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
