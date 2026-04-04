  var handleCreateBusiness = function() {
    setLoading(true);
    setError("");

    var token = auth.token;

    fetch("https://raseel-backend.onrender.com/api/businesses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        name_en: businessName.trim(),
        name_ar: businessNameAr.trim() || businessName.trim(),
        city: city,
        sector: sector
      })
    })
    .then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) {
          throw new Error(err.detail || "Failed to create business");
        });
      }
      return res.json();
    })
    .then(function(business) {
      return fetch("https://raseel-backend.onrender.com/api/products/seed/" + business.id, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      .then(function(seedRes) {
        return seedRes.json().catch(function() { return {}; });
      })
      .then(function() {
        setLoading(false);
        setDone(true);
        setTimeout(function() {
          window.location.href = "/";
        }, 2000);
      });
    })
    .catch(function(err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    });
  };
