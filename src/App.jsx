import { useState, useEffect } from "react";
import InputBox from "./components/InputBox";
import { MdOutlineSwapCalls } from "react-icons/md";
import { BsSun, BsMoon } from "react-icons/bs"; // Icons for light/dark mode

const API_KEY = "de90e4ccbfed5e1f48533452";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

function App() {
    const [amount, setAmount] = useState("");
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("INR");
    const [convertedAmount, setConvertedAmount] = useState("");
    const [exchangeRate, setExchangeRate] = useState(1);
    const [comparisonRates, setComparisonRates] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const [favorites, setFavorites] = useState([]); // State for favorite currencies

    useEffect(() => {
        if (from && to) {
            fetch(`${API_URL}/${from}`)
                .then((response) => response.json())
                .then((data) => {
                    setExchangeRate(data.conversion_rates[to]);
                    convert(amount, data.conversion_rates[to]);
                    fetchComparisonRates(data.conversion_rates);
                })
                .catch((error) => console.error("Error fetching exchange rates:", error));
        }
    }, [from, to, amount]);

    const fetchComparisonRates = (conversionRates) => {
        const comparisonCurrencies = ["EUR", "GBP", "AUD", "CAD", "JPY"];
        const rates = comparisonCurrencies.reduce((acc, currency) => {
            acc[currency] = conversionRates[currency];
            return acc;
        }, {});
        setComparisonRates(rates);
    };

    const swapCurrencies = () => {
        setFrom(to);
        setTo(from);
        setAmount(convertedAmount);
        setConvertedAmount(amount);
    };

    const convert = (amount, rate) => {
        if (!isNaN(amount)) {
            setConvertedAmount((amount * rate).toFixed(2));
        }
    };

    const toggleFavorite = (currency) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(currency)) {
                return prevFavorites.filter((fav) => fav !== currency); // Remove if already a favorite
            } else {
                return [...prevFavorites, currency]; // Add to favorites
            }
        });
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div
            className={`absolute inset-0 flex justify-center items-center transition-all duration-300 ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
            style={{
                backgroundImage: darkMode
                    ? `none`
                    : `url('https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className={`bg-white/30 border ${darkMode ? "border-gray-700" : "border-gray-60"} rounded-lg p-5 backdrop-blur-sm max-w-md w-full`}>
                {/* Toggle Button for Dark/Light Mode */}
                <div className="flex justify-end mb-4">
                    <button className="bg-transparent border-none cursor-pointer text-xl" onClick={toggleDarkMode}>
                        {darkMode ? <BsSun /> : <BsMoon />}
                    </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="mb-4">
                    <div className="mb-1">
                        <InputBox
                            label="From"
                            amount={amount}
                            currencyOptions={["USD", "INR", "EUR", "GBP", "TON"]}
                            onCurrencyChange={(currency) => setFrom(currency)}
                            selectCurrency={from}
                            onAmountChange={(value) => {
                                setAmount(value);
                                convert(value, exchangeRate);
                            }}
                        />
                    </div>
                    <div className="relative mb-4">
                        <button
                            type="button"
                            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                            onClick={swapCurrencies}
                        >
                            <MdOutlineSwapCalls className="text-3xl" />
                        </button>
                    </div>
                    <div className="mb-4">
                        <InputBox
                            label="To"
                            amount={convertedAmount}
                            currencyOptions={["USD", "INR", "EUR", "GBP", "TON"]}
                            onCurrencyChange={(currency) => setTo(currency)}
                            selectCurrency={to}
                            amountDisable
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg">
                        Convert {from.toUpperCase()} to {to.toUpperCase()}
                    </button>
                </form>

                {/* Currency Comparison Section */}
                <div className="mt-4">
                    <h3 className="font-bold">Comparison Rates</h3>
                    <ul className="mb-4">
                        {Object.entries(comparisonRates).map(([currency, rate]) => (
                            <li key={currency} className="flex justify-between">
                                <span>{currency}:</span>
                                <span>{rate.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Favorite Currencies Section */}
                <div className="mt-4">
                    <h3 className="font-bold">Favorite Currencies</h3>
                    <ul className="mb-2">
                        {favorites.map((currency) => (
                            <li key={currency} className="flex justify-between">
                                <span>{currency}</span>
                                <button onClick={() => toggleFavorite(currency)} className="text-red-500">Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h4 className="mt-2">Add to Favorites</h4>
                    <div className="flex space-x-2">
                        {["USD", "INR", "EUR", "GBP", "TON"].map((currency) => (
                            <button
                                key={currency}
                                className={`border px-2 py-1 rounded ${favorites.includes(currency) ? "bg-green-500 text-white" : "bg-gray-200"}`}
                                onClick={() => toggleFavorite(currency)}
                            >
                                {currency}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
