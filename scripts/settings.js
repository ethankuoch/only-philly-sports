/**
 * Syncs browser storage with either a boolean or value from league or league team
 */
function saveOptions() {
  chrome.storage.sync.set(
    {
      nfl: document.getElementById("nfl").checked,
      nfl_abbrev: document.getElementById("nfl_abbrev").value,
      nba: document.getElementById("nba").checked,
      nba_abbrev: document.getElementById("nba_abbrev").value,
      mlb: document.getElementById("mlb").checked,
      mlb_abbrev: document.getElementById("mlb_abbrev").value,
      nhl: document.getElementById("nhl").checked,
      nhl_abbrev: document.getElementById("nhl_abbrev").value,
      military_format: document.getElementById("military_format").checked,
    },
    function () {
      document.getElementById("save").textContent = "Options saved.";
      setTimeout(function () {
        document.getElementById("save").textContent = "Save";
      }, 750);
    },
  );
}

/**
 * Restores the settings states via browser storage
 */
function restoreOptions() {
  chrome.storage.sync.get(
    ["nfl", "nba", "mlb", "nhl", "military_format"],
    function (results) {
      for (const name in results) {
        document.getElementById(name).checked = results[name];
      }
    },
  );

  chrome.storage.sync.get(
    ["nfl_abbrev", "nba_abbrev", "mlb_abbrev", "nhl_abbrev"],
    function (results) {
      for (const name in results) {
        document.getElementById(name).value = results[name];
      }
    },
  );
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
