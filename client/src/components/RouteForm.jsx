import { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';
import '../styles/RouteFormStyles.css';


const LocationInput = ({ onSelect, placeholder }) => {

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  return (
    <Combobox
      onSelect={async (address) => {
        setValue(address, false);
        try {
          const results = await getGeocode({ address });
          const latLng = await getLatLng(results[0]);
          onSelect(latLng);
        } catch (error) {
          console.error('Error getting geocode: ', error);
        }
        clearSuggestions();
      }}
    >
      <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder={placeholder}
        className="location-input"
      />
      <ComboboxPopover style={{ backgroundColor: 'white' }}>
        <ComboboxList>
          {status === 'OK' &&
            data.map(({ id, description }, index) => (
              <ComboboxOption key={id || description || index} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

const RouteForm = ({ onFindRoute }) => {

  const [originLatLng, setOriginLatLng] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onFindRoute({
      origin: originLatLng,
      destination: destinationLatLng,
    });
  };

  return (
    <Container fluid className="route-form-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4} lg={3}>
          <form onSubmit={handleSubmit}>
            <div className="inline-form">
              <LocationInput onSelect={setOriginLatLng} placeholder="Vendosni Piken e nisjes" />
              <LocationInput onSelect={setDestinationLatLng} placeholder="Vendosni Destinacionin" />
              <Button variant="success" type="submit" className="submit-button">
                Find Route
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default RouteForm;









