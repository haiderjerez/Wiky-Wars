document.addEventListener('DOMContentLoaded', function() {
    const categories = ['people', 'planets', 'starships', 'species', 'vehicles', 'films'];
    const categoryElements = {
        'people': document.getElementById('characters'),
        'planets': document.getElementById('planets'),
        'starships': document.getElementById('starships'),
        'species': document.getElementById('species'),
        'vehicles': document.getElementById('vehicles'),
        'films': document.getElementById('films')
    };

    categories.forEach(category => {
        fetch(`https://swapi.py4e.com/api/${category}/`)
            .then(response => response.json())
            .then(data => {
                const list = categoryElements[category].querySelector('.items-list');
                if (list && data.results) {
                    data.results.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.textContent = item.name || item.title;
                        listItem.addEventListener('click', () => showDetails(item, category));
                        list.appendChild(listItem);
                    });
                }
                categoryElements[category].addEventListener('click', () => toggleList(list));
            })
            .catch(error => console.error('Error:', error));
    });

    document.getElementById('search-btn').addEventListener('click', function() {
        const query = document.getElementById('query').value.toLowerCase();
        const resultsContainer = document.getElementById('details');

        resultsContainer.innerHTML = '<p>Buscando...</p>';
        resultsContainer.style.display = 'block';

        let promises = categories.map(category => 
            fetch(`https://swapi.py4e.com/api/${category}/?search=${query}`)
                .then(response => response.json())
                .catch(error => {
                    console.error('Error:', error);
                    return { results: [] };
                })
        );

        Promise.all(promises)
            .then(dataArrays => {
                resultsContainer.innerHTML = '';
                let found = false;
                
                dataArrays.forEach((data, index) => {
                    if (data.results && data.results.length > 0) {
                        found = true;
                        data.results.forEach(item => {
                            const resultItem = document.createElement('div');
                            resultItem.classList.add('result-item');
                            resultItem.innerHTML = `
                                <h2>${item.name || item.title}</h2>
                                ${generateDescription(item, categories[index])}
                            `;
                            resultsContainer.appendChild(resultItem);
                        });
                    }
                });

                if (!found) {
                    resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultsContainer.innerHTML = '<p>Ocurrió un error al buscar la información.</p>';
            });
    });

    function toggleList(list) {
        if (list) {
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
        }
    }

    function showDetails(item, category) {
        const detailsSection = document.getElementById('details');
        detailsSection.style.display = 'block';
        detailsSection.innerHTML = `
            <h2>${item.name || item.title}</h2>
            ${generateDescription(item, category)}
        `;
    }

    function generateDescription(item, category) {
        const translations = {
            'hair_color': {
                'blond': 'rubio',
                'brown': 'marrón',
                'black': 'negro',
                'red': 'rojo',
                'grey': 'gris',
                'white': 'blanco',
                'n/a': 'no aplica',
                'none': 'ninguno'
            },
            'skin_color': {
                'fair': 'clara',
                'gold': 'dorada',
                'white': 'blanca',
                'light': 'ligera',
                'green': 'verde',
                'blue': 'azul',
                'red': 'roja',
                'yellow': 'amarilla',
                'brown': 'marrón',
                'dark': 'oscura',
                'black': 'negra',
                'unknown': 'desconocido'
            },
            'eye_color': {
                'blue': 'azul',
                'yellow': 'amarillo',
                'red': 'rojo',
                'brown': 'marrón',
                'green': 'verde',
                'black': 'negro',
                'orange': 'naranja',
                'hazel': 'avellana',
                'pink': 'rosa',
                'white': 'blanco',
                'gold': 'dorado',
                'unknown': 'desconocido'
            },
            'gender': {
                'male': 'masculino',
                'female': 'femenino',
                'n/a': 'no aplica',
                'none': 'ninguno',
                'hermaphrodite': 'hermafrodita'
            },
        };

        function translate(property, value) {
            return translations[property] && translations[property][value] ? translations[property][value] : value;
        }

        let description = '';

        switch (category) {
            case 'people':
                description = `
                    <p><strong>Altura:</strong> ${item.height} cm</p>
                    <p><strong>Peso:</strong> ${item.mass} kg</p>
                    <p><strong>Color de cabello:</strong> ${translate('hair_color', item.hair_color)}</p>
                    <p><strong>Color de piel:</strong> ${translate('skin_color', item.skin_color)}</p>
                    <p><strong>Color de ojos:</strong> ${translate('eye_color', item.eye_color)}</p>
                    <p><strong>Año de nacimiento:</strong> ${item.birth_year}</p>
                    <p><strong>Género:</strong> ${translate('gender', item.gender)}</p>
                `;
                break;
            case 'planets':
                description = `
                    <p><strong>Clima:</strong> ${item.climate}</p>
                    <p><strong>Gravedad:</strong> ${item.gravity}</p>
                    <p><strong>Terreno:</strong> ${item.terrain}</p>
                    <p><strong>Diámetro:</strong> ${item.diameter} km</p>
                    <p><strong>Población:</strong> ${item.population}</p>
                `;
                break;
            case 'starships':
                description = `
                    <p><strong>Modelo:</strong> ${item.model}</p>
                    <p><strong>Fabricante:</strong> ${item.manufacturer}</p>
                    <p><strong>Costo en créditos:</strong> ${item.cost_in_credits}</p>
                    <p><strong>Longitud:</strong> ${item.length} m</p>
                    <p><strong>Capacidad de carga:</strong> ${item.cargo_capacity} kg</p>
                    <p><strong>Pasajeros:</strong> ${item.passengers}</p>
                `;
                break;
            case 'species':
                description = `
                    <p><strong>Clasificación:</strong> ${item.classification}</p>
                    <p><strong>Designación:</strong> ${item.designation}</p>
                    <p><strong>Promedio de altura:</strong> ${item.average_height} cm</p>
                    <p><strong>Promedio de vida:</strong> ${item.average_lifespan} años</p>
                    <p><strong>Lenguaje:</strong> ${item.language}</p>
                `;
                break;
            case 'vehicles':
                description = `
                    <p><strong>Modelo:</strong> ${item.model}</p>
                    <p><strong>Fabricante:</strong> ${item.manufacturer}</p>
                    <p><strong>Costo en créditos:</strong> ${item.cost_in_credits}</p>
                    <p><strong>Longitud:</strong> ${item.length} m</p>
                    <p><strong>Capacidad de carga:</strong> ${item.cargo_capacity} kg</p>
                    <p><strong>Pasajeros:</strong> ${item.passengers}</p>
                `;
                break;
            case 'films':
                description = `
                    <p><strong>Episodio:</strong> ${item.episode_id}</p>
                    <p><strong>Director:</strong> ${item.director}</p>
                    <p><strong>Productor:</strong> ${item.producer}</p>
                    <p><strong>Fecha de lanzamiento:</strong> ${item.release_date}</p>
                `;
                break;
            default:
                description = '<p>No hay descripción disponible para esta categoría.</p>';
        }

        return description;
    };
});
