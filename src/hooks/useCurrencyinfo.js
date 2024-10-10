import { useEffect, useState } from "react";
import axios from "axios";

function useCurrencyInfo(currency) {
    const [data, setData] = useState({});

    async function getData() {
        try {
            const response = await axios.get(
                `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`
            );
            setData(response.data[currency]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
    }, [currency]);

    return data;
}

export default useCurrencyInfo;
