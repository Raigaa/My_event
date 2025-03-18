const express = require("express");
const axios = require("axios");
const session = require('express-session');
require('dotenv').config();
const User = require("../model/user.model");
const router = express.Router();
const limit = 100;
const maxOffset = 10000 - limit;

const url = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records";

// Middleware pour journaliser les requêtes
router.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  console.log("Request body:", req.body);
  console.log("Query parameters:", req.query);
  next();
});

function getCurrentDateISO() {
  const currentDate = new Date();
  return currentDate.toISOString();
}

async function fetchEvents(params) {
  try {
    console.log("Fetching events with params:", params);
    const response = await axios.get(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message, error.response?.data);
    throw new Error("Error fetching data");
  }
}

async function getTotalCountAndPages(whereClause = "") {
  const params = {
    limit: 1,
    offset: 0,
  };

  if (whereClause) {
    params.where = whereClause;
  }

  const data = await fetchEvents(params);
  const totalCount = data.total_count;
  const totalPages = Math.ceil(totalCount / limit);
  return { totalCount, totalPages };
}

function formatResponse(totalCount, totalPages, currentPage, limit, data, error = null) {
  return {
    totalCount,
    totalPages,
    currentPage,
    limit,
    data,
    error,
  };
}

// Route POST pour récupérer les événements avec pagination et option de restriction de date
router.post("/events/:page", async (req, res) => {
  const page = parseInt(req.params.page, 10);
  console.log("La page est :" + page);

  const { restrictDate, minAge, maxAge, ignoreMinAge, ignoreMaxAge, country } = req.body;

  if (page < 1) {
    return res.status(400).json({ error: "Page number must be 1 or greater" });
  }

  try {
    let whereClause = "";
    if (restrictDate) {
      const currentDate = getCurrentDateISO();
      whereClause += `firstdate_begin >= '${currentDate}'`;
    }

    if (!ignoreMinAge && minAge !== null) {
      whereClause += (whereClause ? " AND " : "") + `age_min >= ${minAge}`;
    }

    if (!ignoreMaxAge && maxAge !== null) {
      whereClause += (whereClause ? " AND " : "") + `age_max <= ${maxAge}`;
    }

    if (country) {
      whereClause += (whereClause ? " AND " : "") + `country_fr = '${country}'`;
    }

    console.log("Where clause:", whereClause);

    const { totalCount, totalPages } = await getTotalCountAndPages(whereClause);
    console.log(totalCount);

    if (totalCount === 0) {
      return res.status(404).json(formatResponse(totalCount, totalPages, page, limit, [], "Aucun événement trouvé pour les critères spécifiés."));
    }

    if (page > totalPages) {
      return res.status(400).json(formatResponse(totalCount, totalPages, page, limit, [], `Page number must be less than or equal to ${totalPages}`));
    }

    let offset = (page - 1) * limit;
    if (offset > maxOffset) {
      offset = maxOffset;
    }

    const data = await fetchEvents({ limit, offset, where: whereClause });

    res.json(formatResponse(totalCount, totalPages, page, limit, data, null));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Route POST pour récupérer les événements basé sur la localisation avec pagination et option de restriction de date
router.post("/events/localisation/:page", async (req, res) => {
  console.log("Request body:", req.body);
  const page = parseInt(req.params.page, 10);
  const { latitude, longitude, radius, restrictDate, minAge, maxAge, ignoreMinAge, ignoreMaxAge } = req.body;

  if (isNaN(page) || page < 1) {
    return res.status(400).send("Page number must be 1 or greater");
  }

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).send("Valid latitude and longitude are required");
  }

  try {
    let whereClause = `within_distance(location_coordinates, GEOM'POINT(${longitude} ${latitude})', ${radius}km)`;

    if (restrictDate) {
      const currentDate = getCurrentDateISO();
      whereClause += ` AND firstdate_begin >= '${currentDate}'`;
    }

    if (!ignoreMinAge && minAge !== null) {
      whereClause += ` AND age_min >= ${minAge}`;
    }

    if (!ignoreMaxAge && maxAge !== null) {
      whereClause += ` AND age_max <= ${maxAge}`;
    }

    console.log("Where clause:", whereClause);

    const { totalCount, totalPages } = await getTotalCountAndPages(whereClause);

    if (page > totalPages) {
      return res.status(400).send(`Page number must be less than or equal to ${totalPages}`);
    }

    let offset = (page - 1) * limit;
    if (offset > maxOffset) {
      offset = maxOffset;
    }

    const data = await fetchEvents({ limit, offset, where: whereClause });

    res.json(formatResponse(totalCount, totalPages, page, limit, data));
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

async function getMinMaxAge() {
  try {
    // Requête pour obtenir l'âge minimum
    const minAgeParams = {
      limit: 1,
      order_by: "age_min ASC",
      where: "age_min IS NOT NULL",
    };
    const minAgeData = await fetchEvents(minAgeParams);
    const minAge = minAgeData.results[0]?.age_min || null;

    // Requête pour obtenir l'âge maximum
    const maxAgeParams = {
      limit: 1,
      order_by: "age_max DESC",
      where: "age_max IS NOT NULL",
    };
    const maxAgeData = await fetchEvents(maxAgeParams);
    const maxAge = maxAgeData.results[0]?.age_max || null;

    return { minAge, maxAge };
  } catch (error) {
    throw new Error("Error fetching data: " + error.message);
  }
}

async function getAllCountry() {
  try {
    const params = {
      select: "country_fr",
      group_by: "country_fr",
      order_by: "country_fr ASC",
      limit: 100,
      offset: 0,
      where: "country_fr IS NOT NULL",
    };

    const uniqueCountries = new Set();
    let hasMore = true;

    while (hasMore) {
      const response = await fetchEvents(params);
      const countriesData = response.results;

      if (countriesData.length === 0) {
        hasMore = false;
        break;
      }

      countriesData.forEach((item) => {
        if (item.country_fr) {
          uniqueCountries.add(item.country_fr);
        }
      });

      params.offset += params.limit;
    }

    const uniqueCountriesArray = Array.from(uniqueCountries);
    return uniqueCountriesArray;
  } catch (error) {
    throw new Error("Error fetching countries: " + error.message);
  }
}

router.get("/events/filters", async (req, res) => {
  try {
    const countries = await getAllCountry();
    const { minAge, maxAge } = await getMinMaxAge();
    res.json({ minAge, maxAge, countries });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error fetching data");
  }
});

router.get("/events/uid/:uid", async (req, res) => {

  try {
    const uid = parseInt(req.params.uid, 10);

    const params = {
      where: `uid = ${uid}`,
      limit: 20,
    }

    const data = await axios.get(url, { params: params });

    console.log(data.data);

    const event = data.data.results[0];
    res.status(200).json(event)
  } catch (error) {
    console.error("Erreur lors de la récupértion des données: ", error.message);
    res.status(500).send("Erreur lors de la récupération des données");
  }

});

module.exports = router;