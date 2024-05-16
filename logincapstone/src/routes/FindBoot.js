import React, { useState } from 'react';
import './FindBoot.css';

const bootcamps = [
    '부트캠프 1',
    '부트캠프 2',
    '부트캠프 3',
    '부트캠프 4',
    '부트캠프 5'
];

function FindBoot() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredBootcamps = bootcamps.filter((bootcamp) =>
        bootcamp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="find-boot-container">
            <div className="bootcamp-list">
                <h2>부트캠프 목록</h2>
                <ul>
                    {filteredBootcamps.map((bootcamp, index) => (
                        <li key={index}>{bootcamp}</li>
                    ))}
                </ul>
            </div>
            <div className="search-container">
                <h2>부트캠프 검색</h2>
                <input
                    type="text"
                    placeholder="부트캠프 이름 검색"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
        </div>
    );
}

export default FindBoot;
