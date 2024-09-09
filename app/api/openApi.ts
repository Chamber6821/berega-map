import {Building, DescriptionLine} from "./berega";
import {FilterGroup, Filters} from "../filters/useFilters";

export type PointsTypeOpenApi = {
    id: string;
    latitude: number;
    longitude: number;
    postDate: string;
    houseStatus: string
};

export type PointsCountTypeOpenApi = {
    counter: number,
    latitude: number,
    longitude: number,
    houseStatus: string
}

export type BuildingTypeOpenApi = {
    id: string;
    url: string,
    title: string;
    house_type: string;
    transaction_type: string;
    house_status: string;
    address: string;
    post_date: string;
    owner_name: string;
    images: string[];
    description: string;
    price_usd: number;
    price_gel: number;
    price_per_square_usd: number;
    price_per_square_gel: number;
    latitude: number;
    longitude: number;
    renovation: string;
    project: string;
    area: number;
    rooms: string;
    floor: number;
    yard_area: number;
    house_floors: number;
    ceiling_height: number;
    bedroom: string;
    bathrooms: string;
    balcony_area: number;
    hot_water: string;
    heating: string;
    parking: string;
    has_electricity: boolean;
    has_natural_gas: boolean;
    has_sewage: boolean;
    has_water: boolean;
    has_furniture: boolean;
    has_loggia: boolean;
    has_passenger_elevator: boolean;
    has_service_elevator: boolean;
    has_viber: boolean;
    has_whatsapp: boolean;
    is_urgent: boolean;
    is_highlighted: boolean;
    is_moved_up: boolean;
    user_entity_type: string;
    agency_name: string;
    subway_station: string;
    has_remote_viewing: boolean;
    company_name: string;
    company_logo: string;
    project_name: string;
    project_id: number;
    garage: boolean;
    kitchen_area: string;
    house_will_have_to_live: string;
    commercial_type: number;
    user_application_count: number;
    price_level: string;
}

const baseOpenApiUrl = () => "https://berega.tech/api/real-estate";

const radiusKm =  10;
const popularPlaces = [
    {centerLatitude: 41.7151, centerLongitude: 44.8271}, // Тбилиси
    {centerLatitude: 42.2679, centerLongitude: 42.6946}, // Кутаиси
    {centerLatitude: 41.6168, centerLongitude: 41.6367}, // Батуми
    {centerLatitude: 41.5400, centerLongitude: 45.0000}, // Рустави
    {centerLatitude: 42.5088, centerLongitude: 41.8709}  // Зугдиди
]

export const convertBuilding = async (building: BuildingTypeOpenApi): Promise<Building> => {
    const shortDescription: DescriptionLine = [
        ''
    ];
    const description: DescriptionLine[] = [
        ["Цена", building.price_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })],
        ['Цена за м²', `${building.price_per_square_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`],
        [`${building.floor ? building.floor : '-'} этаж, ${building.area} м²`],
        ...(building.house_status === 'New building' ? [['Владелец', building.owner_name ? building.owner_name : 'Неизвестно'] as [string, string]] : [])
    ];


    const group: FilterGroup = building.house_status === 'new' ? 'Новостройки' : 'Вторичное жилье';
    const rooms = ({
        'Студия': 'Студия',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5+': '5+'
    } as const)[building.rooms] || '2';
    return {
        title: building.title,
        tag: building.renovation,
        image: building.images?.[0],
        shortDescription,
        description,
        price: building.price_usd,
        area: building.area,
        floor: building.floor,
        frame: building.renovation,
        location: {
            lat: building.latitude,
            lng: building.longitude,
            address: building.address
        },
        page: `https://${building.url}`,
        group,
        rooms,
        created: new Date(building.post_date),
    };
}

const urlForFilteredPoints = (
    center: [number, number],
    size: number,
    filters: Filters
) => {
    const params = new URLSearchParams({
        centerLatitude: center[1].toString(),
        centerLongitude: center[0].toString(),
        radiusKm: radiusKm.toString(),
        page: '0',
        size: size.toString(),
    });

    if (filters.priceRange[0]) params.append('minPriceUsd', filters.priceRange[0].toString());
    if (filters.priceRange[1]) params.append('maxPriceUsd', filters.priceRange[1].toString());
    if (filters.areaRange[0]) params.append('minArea', filters.areaRange[0].toString());
    if (filters.areaRange[1]) params.append('maxArea', filters.areaRange[1].toString());
    if (filters.floorRange[0]) params.append('minFloor', filters.floorRange[0].toString());
    if (filters.floorRange[1]) params.append('maxFloor', filters.floorRange[1].toString());
    if (filters.rooms.length > 0) {
        filters.rooms.map((item) => {
            params.append('rooms', item.toString());
        })
    }
    if (filters.groups.includes('Новостройки') || filters.status.includes('Новостройки')) {
        params.append('houseStatus', 'New building');
    }
    if (filters.groups.includes('Вторичное жилье') || filters.status.includes('Вторичное жильё')) {
        params.append('houseStatus', 'Old building');
    }
    if (filters.groups.includes('Дома, коттеджи')) {
        params.append('houseStatus', 'Finished');
    }
    if (filters.groups.includes('Зем. участки')) {
        params.append('houseStatus', 'Investment / for construction');
    }
    if (filters.groups.includes('Коммерческая')) {
        params.append('houseStatus', 'Commercial');
    }

    if (filters.frame.length > 0) params.append('frame', filters.frame.join(','));
    if (filters.createdAfter) {
        params.append('startPostDate', new Date(filters.createdAfter).toISOString().replace('Z', '+04:00'));
    }

    return `${baseOpenApiUrl()}/filter?${params.toString()}`;
};

export const fetchPointsCounter = async (
    filters: Filters
): Promise<PointsCountTypeOpenApi[]>  => {
    const params = new URLSearchParams({
        radiusKm: '5',
    });
    const houseStatus: string[] = [];

    if (filters.priceRange[0]) params.append('minPriceUsd', filters.priceRange[0].toString());
    if (filters.priceRange[1]) params.append('maxPriceUsd', filters.priceRange[1].toString());
    if (filters.areaRange[0]) params.append('minArea', filters.areaRange[0].toString());
    if (filters.areaRange[1]) params.append('maxArea', filters.areaRange[1].toString());
    if (filters.floorRange[0]) params.append('minFloor', filters.floorRange[0].toString());
    if (filters.floorRange[1]) params.append('maxFloor', filters.floorRange[1].toString());
    if (filters.rooms.length > 0) {
        filters.rooms.forEach((room) => {
            params.append('rooms', room.toString());
        });
    }
    if (filters.groups.includes('Новостройки') || filters.status.includes('Новостройки')) {
        params.append('houseStatus', 'New building');
        houseStatus.push('Новостройки');
    }
    if (filters.groups.includes('Вторичное жилье') || filters.status.includes('Вторичное жильё')) {
        params.append('houseStatus', 'Old building');
        houseStatus.push('Вторичное жилье');
    }
    if (filters.groups.includes('Дома, коттеджи')) {
        params.append('houseStatus', 'Finished');
        houseStatus.push('Дома, коттеджи');
    }
    if (filters.groups.includes('Зем. участки')) {
        params.append('houseStatus', 'Investment / for construction');
        houseStatus.push('Зем. участки');
    }
    if (filters.groups.includes('Коммерческая')) {
        params.append('houseStatus', 'Commercial');
        houseStatus.push('Коммерческая');
    }
    if (filters.frame.length > 0) {
        params.append('frame', filters.frame.join(','));
    }
    if (filters.createdAfter) {
        params.append('startPostDate', new Date(filters.createdAfter).toISOString().replace('Z', '+04:00'));
    }

    const fetchPromises = popularPlaces.map(async (place) => {
        const centerParams = new URLSearchParams(params.toString());
        centerParams.append('centerLatitude', place.centerLatitude.toString());
        centerParams.append('centerLongitude', place.centerLongitude.toString());

        const response = await fetch(`${baseOpenApiUrl()}/count?${centerParams.toString()}`, { cache: 'no-store' });
        const data: number = await response.json();

        if (data > 0) {
            return {
                counter: data,
                latitude: place.centerLatitude,
                longitude: place.centerLongitude,
                houseStatus: houseStatus[0],
            } as PointsCountTypeOpenApi;
        }

        return null;
    });

    const results = await Promise.all(fetchPromises);
    const pointsCount = results.filter((result) => result !== null) as PointsCountTypeOpenApi[];

    return pointsCount;
}

const chooseHouseStatus = (filters: Filters) : string => {
    if (filters.groups.includes('Новостройки') || filters.status.includes('Новостройки')) {
        return 'Новостройки';
    } else if (filters.groups.includes('Вторичное жилье') || filters.status.includes('Вторичное жильё')) {
        return 'Вторичное жилье';
    } else if (filters.groups.includes('Дома, коттеджи')) {
        return 'Дома, коттеджи';
    } else if (filters.groups.includes('Зем. участки')) {
        return 'Зем. участки';
    } else if (filters.groups.includes('Коммерческая')) {
        return 'Коммерческая';
    } else {
        return '';
    }
}

export const fetchFilteredPoints = async (
    center: [number, number],
    size: number,
    filters: Filters
): Promise<PointsTypeOpenApi[]> => {
    const url = urlForFilteredPoints(center, size, filters);
    const response = await fetch(url, { cache: 'no-store' });
    const points : PointsTypeOpenApi[] = await response.json();
    return points.map((point) => {
        const houseStatus = chooseHouseStatus(filters);
        return {
            ...point,
            houseStatus,
        };
    });
}

export const fetchBuildingById = async (id: string): Promise<BuildingTypeOpenApi> => {
    return (await fetch(`${baseOpenApiUrl()}/${id}`, { cache: 'no-store' })).json();
};

export const fetchBuilding = async (id : string) : Promise<Building> => {
    return await convertBuilding(await fetchBuildingById(id));
}