import React from 'react';

const TimeSelect = ({ value, onChange, required, bgStyle }) => {
    const handleTimeChange = (type, val) => {
        let oldH = '12', oldM = '00', isPM = false;
        if (value) {
            const parts = value.split(':');
            const h24 = parseInt(parts[0], 10);
            oldH = (h24 % 12 || 12).toString().padStart(2, '0');
            oldM = parts[1];
            isPM = h24 >= 12;
        }

        let newH = type === 'h' ? val : oldH;
        let newM = type === 'm' ? val : oldM;
        let newIsPM = type === 'ampm' ? (val === 'PM') : isPM;

        let hour24 = parseInt(newH, 10);
        if (newIsPM && hour24 !== 12) hour24 += 12;
        if (!newIsPM && hour24 === 12) hour24 = 0;

        const finalH = hour24.toString().padStart(2, '0');
        onChange({ target: { value: `${finalH}:${newM}` } });
    };

    const currentValue = value || '';
    let currH = '', currM = '', currAmPm = '';
    if (currentValue) {
        const h24 = parseInt(currentValue.split(':')[0], 10);
        currH = (h24 % 12 || 12).toString().padStart(2, '0');
        currM = currentValue.split(':')[1];
        currAmPm = h24 >= 12 ? 'PM' : 'AM';
    }

    const selectStyle = { 
        background: bgStyle || 'var(--bg-card)', 
        padding: '0.85rem 0.5rem',
        flex: 1,
        minWidth: 0
    };

    return (
        <div style={{ display: 'flex', gap: '0.3rem', width: '100%' }}>
            <select required={required} value={currH} onChange={e => handleTimeChange('h', e.target.value)} style={selectStyle}>
                <option value="" disabled>HH</option>
                {[...Array(12).keys()].map(i => <option key={i+1} value={(i+1).toString().padStart(2, '0')}>{(i+1).toString().padStart(2, '0')}</option>)}
            </select>
            <span style={{ color: '#8a8aa8', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>:</span>
            <select required={required} value={currM} onChange={e => handleTimeChange('m', e.target.value)} style={selectStyle}>
                <option value="" disabled>MM</option>
                {[...Array(60).keys()].map(i => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
            </select>
            <select required={required} value={currAmPm} onChange={e => handleTimeChange('ampm', e.target.value)} style={selectStyle}>
                <option value="" disabled>AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    );
};

export default TimeSelect;
