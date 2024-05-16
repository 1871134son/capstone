import React, { useState } from 'react';
import './FindBoot.css';

const bootcamps = [
    '자격증 1',
    '자격증 2',
    '자격증 3',
    '자격증 4',
    '자격증 5'
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
        </div>
    );
}

export default FindBoot;
