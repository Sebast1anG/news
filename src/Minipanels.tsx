import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';

const MiniPanels = () => {
    const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({})
    const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>({})
    const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

    const apiKey = '0df8f21b3c4848adb5f8157f083c8ed7';
    const container: React.CSSProperties = {
        display: 'flex',
        margin: '0 auto',
        width: '70%',
        height: '200px'
    }
    const children: React.CSSProperties = {
        textAlign: 'center',
        width: '50%',
        height: 'auto',
        borderRadius: '10px',
        padding: '25px',
        margin: '10px',
        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)',
        background: '#b941b2bf',
        transition: 'background 0.3s'
    };

    const count: React.CSSProperties = {
        fontWeight: '600',
        fontSize: '24px',
        marginTop: '10px',
    };
    const categories = [
        { name: 'business', label: 'Business' },
        { name: 'entertainment', label: 'Entertainment' },
        { name: 'technology', label: 'Technology' },
    ];

    const countries = [
        { name: 'us', label: 'USA' },
        { name: 'pl', label: 'Poland' },
        { name: 'uk', label: 'UK' },
    ];
    const fetchDataByCategory = async (category: string) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`
            );

            const totalResults = response.data.totalResults;
            return totalResults;
        } catch (error) {
            console.error('Error while fetching data:', error);
            return 0;
        }
    };

    const fetchDataByCountry = async (country: string) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`
            );

            const totalResults = response.data.totalResults;
            return totalResults;
        } catch (error) {
            console.error('Error while fetching data:', error);
            return 0;
        }
    };
    const handlePanelMouseEnter = (panelName: string) => {
        setHoveredPanel(panelName);
    };

    const handlePanelMouseLeave = () => {
        setHoveredPanel(null);
    };

    useEffect(() => {
        fetchDataByCategory('business').then((count) =>
            setCategoryCounts((prevCounts) => ({
                ...prevCounts,
                business: count,
            }))
        );

        fetchDataByCategory('entertainment').then((count) =>
            setCategoryCounts((prevCounts) => ({
                ...prevCounts,
                entertainment: count,
            }))
        );

        fetchDataByCategory('technology').then((count) =>
            setCategoryCounts((prevCounts) => ({
                ...prevCounts,
                technology: count,
            }))
        );

        fetchDataByCountry('us').then((count) =>
            setCountryCounts((prevCounts) => ({
                ...prevCounts,
                us: count,
            }))
        );

        fetchDataByCountry('pl').then((count) =>
            setCountryCounts((prevCounts) => ({
                ...prevCounts,
                pl: count,
            }))
        );

        fetchDataByCountry('uk').then((count) =>
            setCountryCounts((prevCounts) => ({
                ...prevCounts,
                uk: count,
            }))
        );
    }, []);

    return (
        <div>
            <Navbar />
            <div>
                <h2>Total headlines in category</h2>
                    <div style={container}>
                        {categories.map((category) => (
                            <div key={category.name}
                                style={{ ...children, background: hoveredPanel === category.name ? '#fff' : '#b941b2bf' }}
                                onMouseEnter={() => handlePanelMouseEnter(category.name)}
                                onMouseLeave={handlePanelMouseLeave}>
                                 {category.label} <hr />
                                <p style={count}>{categoryCounts[category.name]}</p>
                            </div>
                        ))}
                    </div>
                <div>
                    <h2>Total headlines in country</h2>
                        <div style={container}>
                            {countries.map((country) => (
                                <div key={country.name}
                                    style={{ ...children, background: hoveredPanel === country.name ? '#fff' : '#b941b2bf' }}
                                    onMouseEnter={() => handlePanelMouseEnter(country.name)}
                                    onMouseLeave={handlePanelMouseLeave}>
                                    {country.label} <hr />
                                    <p style={count}>{countryCounts[country.name]}</p>
                                </div>
                            ))}
                        </div>
                </div>
            </div>
        </div>
    );
};

export default MiniPanels