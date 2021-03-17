import { useCallback, useState, useMemo, createContext, useContext } from 'react'


const MapContext = createContext();

const initialMapValue = {
    lat: 0,
    lng: 0,
    radius: 1
};

export const MapProvider = (props) => {
    const [mapData, setMapData] = useState(initialMapValue)

    const updateValue = useCallback(
        (newValue) => 
    setMapData(prevData => ({ ...prevData, ...newValue })), [mapData])

    const initialValue = useMemo(
        () => ({
          mapData,
          updateValue,
        }),
        [mapData, updateValue]
    );

    return (
        <MapContext.Provider value={initialValue}>
          {props.children}
        </MapContext.Provider>
    )
}

export const useMapContext = () => useContext(MapContext)



