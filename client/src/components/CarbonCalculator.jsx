

const calculateCarbonFootprint = (route) => {
    let carbonPerKm = 0;

    switch (route.mode) {
        case 'Driving':
            carbonPerKm = 0.12;
            break;
        case 'Transit':
            carbonPerKm = 0.08;
            break;
        case 'Walking':
            carbonPerKm = 0;
            break;
        case 'Bicycling':
            carbonPerKm = 0;
            break;
        default:
            console.error(`Unknown mode: ${route.mode}`);
            return;
    }

    const distanceKm = route.distance;
    const carbonFootprint = distanceKm * carbonPerKm;

    return carbonFootprint.toFixed(2); //  kthen rezultatin me dy numra decimal
}

export default calculateCarbonFootprint;
