const addMultiCityTripContainer = document.querySelector(
  '[add-multi-city-trip-container]'
);
const multiCityTripTemplate = document.querySelector(
  '[multi-city-trip-template]'
);

const multiCityTripWrapper = document.querySelector(
  '[multi-city-trip-wrapper]'
);
const addMultiCityTripBtn = document.querySelector('[add-multi-city-trip-btn]');


// add cities
addMultiCityTripBtn.addEventListener('click', () => {
  const multiCity = multiCityTripTemplate.content.cloneNode(true);

  const cityLength = addMultiCityTripContainer.querySelectorAll(
    '[multi-city-trip-wrapper]'
  );

  if (cityLength.length < 4) {
    addMultiCityTripContainer.appendChild(multiCity);
  }
});

// add remove cities
function multiCityRemoveTrip() {
  const multiCityTripRemoveBtn = document.querySelector(
    '[multi-city-trip-remove-btn]'
  );
  const multiCityWrapper = multiCityTripRemoveBtn.parentElement;
  multiCityWrapper.remove();
}

multiCitySearch();


// add cities function
function multiCitySearch() {

  const flightDropdownCardsBasic = document.querySelectorAll(
    '[flight__dropdown-card-basic]'
  );

  flightDropdownCardsBasic.forEach((flightDropdownCard) => {
    flightDropdownCard.addEventListener('click', () => {
      const flightInputs = flightDropdownCard.children[1];
      const flightInputLocation = flightInputs.children[0];
      const flightInputAirport = flightInputs.children[1];
      const flightInputsDropdownArrow = flightDropdownCard.children[2];
      const flightDropdown = flightDropdownCard.parentElement;
      const flightDropdownOverlay = flightDropdown.children[2];
      const flightDropdownOptionsContainer = flightDropdown.children[1];

      flightDropdownOptionsContainer.scrollTo(0, 0);
      flightInputsDropdownArrow.classList.toggle('active');
      flightDropdownOptionsContainer.classList.toggle('active');

      if (flightInputsDropdownArrow.classList.contains('active')) {
        flightDropdownOverlay.classList.add('active');
      } else {
        flightDropdownOverlay.classList.remove('active');
        flightDropdownOptionsContainer.scrollTo(0, 0);
      }

      //
      const flightDropdownOptionsWrapper =
        flightDropdownOptionsContainer.children[1];
      const flightOptions = flightDropdownOptionsWrapper.querySelectorAll('li');
      const flightSearchBox = flightDropdownOptionsContainer.children[0];
      const flightInput = flightSearchBox.children[1];

      // search airport_location.json and filter it
      const searchAirportLocation = async (searchText) => {
        const res = await fetch(
          '/resources/airport_json/airport_autosuggetion.json'
        );
        const locations = await res.json();

        // Get matches to current text input
        let matches_rules = [];
        let matches_a = locations.filter((location) => {
          const regex = new RegExp(`^${searchText}`, 'gi');
          return location.code.match(regex);
        });

        let matches_b = locations.filter((location) => {
          const regex = new RegExp(searchText, 'i');
          return location.search_contents.match(regex);
        });

        matches_rules = $.merge(matches_a, matches_b);

        if (searchText.length === 0) {
          matches_rules = [];
        }

        outputResult(matches_rules);
        searchResult();
      };

      // Show result in html
      const outputResult = (matches) => {
        if (matches.length > 0) {
          const html = matches
            .map(
              (match) => `
              <li flight__search-result onclick="searchResult()" class="flight__info">
                  <div>
                    <p class="flight__info-location">${match.city_name}</p>
                    <p class="flight__info-airport">
                    ${match.city_name} - ${match.airport_name}
                    </p>
                  </div>
                  <h5 class="flight__info-code">${match.code}</h5>
                </li>
              `
            )
            .join('');
          flightDropdownOptionsWrapper.innerHTML = html;
        }
      };

      flightInput.addEventListener('input', () => {
        searchAirportLocation(flightInput.value);
      });

      flightDropdownOverlay.addEventListener('click', () => {
        flightInputsDropdownArrow.classList.remove('active');
        flightDropdownOptionsContainer.scrollTo(0, 0);
        flightInput.value = '';
        flightDropdownOptionsContainer.classList.remove('active');
        flightDropdownOverlay.classList.remove('active');
      });
    });
  });
}
