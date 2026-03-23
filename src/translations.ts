import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  en: {
    // Header
    header: {
      tagline: "Course Analytics",
      portalLabel: "Golf Course Management Portal",
      logout: "Log out",
      logoutShort: "Exit",
      switchCourse: "Switch course",
      switchLanguageTooltip: "Switch language / Taal wisselen",
    },

    // Dashboard
    dashboard: {
      sectionHeading: "Course Data",
      statsTitle: "Data Overview",
      statsTotalFiles: "Total Files",
      statsMapsAvailable: "Maps Available",
      statsDataSize: "Data Volume",
      statsAvailable: "Availability",
      badgeNew: "New",
    },

    // Dashboard tiles
    tiles: {
      liveMapsTitle: "Live Maps",
      liveMapsDesc: "Interactive course mapping",
      reportsTitle: "Reports",
      reportsDesc: "Analysis & documentation",
      hdMapsTitle: "HD Maps",
      hdMapsDesc: "High-resolution imagery",
      modelsTitle: "3D Models",
      modelsDesc: "Three-dimensional views",
      itemSingular: "item",
      itemPlural: "items",
    },

    // Content section
    contentSection: {
      liveMapsName: "Live Maps",
      liveMapsDesc: "Real-time interactive maps and overlays",
      reportsName: "Reports",
      reportsDesc: "Detailed analysis and documentation",
      hdMapsName: "HD Maps",
      hdMapsDesc: "High-resolution aerial imagery",
      modelsName: "3D Models",
      modelsDesc: "Three-dimensional course representations",
      showMapView: "Show map",
      hideMapView: "Hide map",
      searchPlaceholder: "Search files…",
      available: "Available",
      fileSingular: "file",
      filePlural: "files",
      noFilesSearch: "No files match your search",
      noFilesEmpty: (name: string) => `No ${name.toLowerCase()} available yet`,
      loadingContent: "Loading content…",
    },

    // Content viewer
    contentViewer: {
      subtitle: "Access your mapping data and reports",
      showMap: "Show map",
      hideMap: "Hide map",
      searchPlaceholder: "Search files…",
      grid: "Grid",
      list: "List",
      noFilesSearch: "No files match your search",
      noFilesEmpty: (name: string) => `No ${name.toLowerCase()} available yet`,
      loadingContent: "Loading content…",
    },

    // Drone uploader
    droneUploader: {
      cardTitle: "Upload Drone Imagery",
      cardDesc: (courseName: string) =>
        `Upload raw drone images (JPEG / PNG / TIFF) for ${courseName}.`,
      labelFlightDate: "Flight Date",
      labelFlightTime: "Flight Time",
      extracting: "Extracting…",
      extractedAuto: "Extracted automatically",
      labelImages: "Drone Images *",
      dropActive: "Drop your files here…",
      dropIdle: "Drag & drop image files here, or click to select",
      dropHint: "Supports JPEG, PNG, TIFF · Max 50 MB per file",
      filesSelected: (n: number) => `${n} ${n === 1 ? "file" : "files"} selected`,
      remove: "Remove",
      clearAll: "Clear all",
      uploading: "Uploading images…",
      processing: "Processing…",
      uploadBtn: (n: number) => `Upload ${n} ${n === 1 ? "image" : "images"}`,
      successMsg:
        "Images uploaded successfully. They are now in the processing queue.",
      errMissingFields:
        "Please provide a flight date, time, and select at least one image.",
      errNoExif: "No EXIF date found in the first image.",
      errBadExif: "Could not read a valid date from the image metadata.",
      errExifFailed:
        "Failed to extract metadata. Make sure the images contain valid EXIF data.",
    },

    // Recent uploads
    recentUploads: {
      cardTitle: "Recent Uploads",
      cardSubtitle:
        "Files uploaded in the last 24 hours. Select files to delete them.",
      selectAll: "Select all",
      deselectAll: "Deselect all",
      selectedSummary: (sel: number, total: number, size: string) =>
        `${sel} of ${total} selected (${size})`,
      deleteSelected: (n: number) => `Delete ${n}`,
      deleting: "Deleting…",
      loading: "Loading uploads…",
      totalLabel: "Total:",
      last24h: "Uploaded in the last 24 h",
      justNow: "Just now",
      minutesAgo: (m: number) => `${m}m ago`,
      hoursAgo: (h: number) => `${h}h ago`,
      deleteTooltip: "Delete this file",
      dialogTitle: "Are you sure?",
      dialogDescSingle: (name: string) =>
        `You are about to permanently delete "${name}". This cannot be undone.`,
      dialogDescBatch: (n: number) =>
        `You are about to permanently delete ${n} ${
          n === 1 ? "file" : "files"
        }. This cannot be undone.`,
      dialogCancel: "Cancel",
      dialogConfirm: "Delete",
      successDeletedSingle: (name: string) => `Deleted "${name}"`,
      successDeletedBatch: (n: number, skipped: number) => {
        let msg = `Successfully deleted ${n} ${n === 1 ? "file" : "files"}`;
        if (skipped > 0) msg += ` (${skipped} skipped — older than 24 h)`;
        return msg;
      },
    },

    // Mapbox map panel
    map: {
      panelTitle: "Active Layers",
      drawOrder: "Draw Order",
      showAll: "Show All",
      hideAll: "Hide All",
      noLayers: "No layers available for this course.",
      loadingMap: "Loading Map",
      loadingMapDesc: "Fetching golf course data…",
      mapNotAvailable: "Map Not Available",
      mapNotAvailableDesc: "No map data found for this golf course",
      layersBtn: "Layers",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      showLabels: "Show labels",
      hideLabels: "Hide labels",
      resetView: "Back to course view",
      centerLocation: "Center on my location",
      enterFullscreen: "Enter fullscreen",
      exitFullscreen: "Exit fullscreen",
      compareMaps: "Compare Maps",
      exitCompare: "Exit Compare",
      baseImageryOpacity: "Base Imagery Opacity",
      baseSatellite: "Base Map (Satellite)",
    },
  },

  nl: {
    // Header
    header: {
      tagline: "Baananalyse",
      portalLabel: "Golfbaanbeheerportaal",
      logout: "Uitloggen",
      logoutShort: "Afsluiten",
      switchCourse: "Baan wisselen",
      switchLanguageTooltip: "Switch language / Taal wisselen",
    },

    // Dashboard
    dashboard: {
      sectionHeading: "Baangegevens",
      statsTitle: "Gegevensoverzicht",
      statsTotalFiles: "Bestanden totaal",
      statsMapsAvailable: "Beschikbare kaarten",
      statsDataSize: "Datavolume",
      statsAvailable: "Beschikbaarheid",
      badgeNew: "Nieuw",
    },

    // Dashboard tiles
    tiles: {
      liveMapsTitle: "Live kaarten",
      liveMapsDesc: "Interactieve baanweergave",
      reportsTitle: "Rapporten",
      reportsDesc: "Analyse & documentatie",
      hdMapsTitle: "HD-kaarten",
      hdMapsDesc: "Hoogresolutie beeldmateriaal",
      modelsTitle: "3D-modellen",
      modelsDesc: "Driedimensionale baanweergave",
      itemSingular: "item",
      itemPlural: "items",
    },

    // Content section
    contentSection: {
      liveMapsName: "Live kaarten",
      liveMapsDesc: "Realtime interactieve kaarten en lagen",
      reportsName: "Rapporten",
      reportsDesc: "Uitgebreide analyse en documentatie",
      hdMapsName: "HD-kaarten",
      hdMapsDesc: "Luchtfotografie in hoge resolutie",
      modelsName: "3D-modellen",
      modelsDesc: "Driedimensionale baanrepresentaties",
      showMapView: "Kaart tonen",
      hideMapView: "Kaart verbergen",
      searchPlaceholder: "Bestanden zoeken…",
      available: "Beschikbaar",
      fileSingular: "bestand",
      filePlural: "bestanden",
      noFilesSearch: "Geen bestanden gevonden voor uw zoekopdracht",
      noFilesEmpty: (name: string) => `Nog geen ${name.toLowerCase()} beschikbaar`,
      loadingContent: "Inhoud laden…",
    },

    // Content viewer
    contentViewer: {
      subtitle: "Bekijk uw kaartgegevens en rapporten",
      showMap: "Kaart tonen",
      hideMap: "Kaart verbergen",
      searchPlaceholder: "Bestanden zoeken…",
      grid: "Raster",
      list: "Lijst",
      noFilesSearch: "Geen bestanden gevonden voor uw zoekopdracht",
      noFilesEmpty: (name: string) => `Nog geen ${name.toLowerCase()} beschikbaar`,
      loadingContent: "Inhoud laden…",
    },

    // Drone uploader
    droneUploader: {
      cardTitle: "Dronebeelden uploaden",
      cardDesc: (courseName: string) =>
        `Upload ruwe dronebeelden (JPEG / PNG / TIFF) voor ${courseName}.`,
      labelFlightDate: "Vluchtdatum",
      labelFlightTime: "Vluchttijd",
      extracting: "Ophalen…",
      extractedAuto: "Automatisch opgehaald",
      labelImages: "Dronebeelden *",
      dropActive: "Zet uw bestanden hier neer…",
      dropIdle: "Sleep bestanden hierheen, of klik om te selecteren",
      dropHint: "Ondersteunde formaten: JPEG, PNG, TIFF · Max. 50 MB per bestand",
      filesSelected: (n: number) =>
        `${n} ${n === 1 ? "bestand" : "bestanden"} geselecteerd`,
      remove: "Verwijderen",
      clearAll: "Alles wissen",
      uploading: "Beelden uploaden…",
      processing: "Verwerken…",
      uploadBtn: (n: number) =>
        `${n} ${n === 1 ? "beeld" : "beelden"} uploaden`,
      successMsg:
        "Beelden succesvol geüpload. Ze staan nu in de verwerkingswachtrij.",
      errMissingFields:
        "Geef een vluchtdatum, -tijd en selecteer minimaal één beeld.",
      errNoExif: "Geen EXIF-datumgegevens gevonden in het eerste beeld.",
      errBadExif: "De datum in de metagegevens van het beeld is ongeldig.",
      errExifFailed:
        "Metagegevens konden niet worden gelezen. Zorg ervoor dat de beelden geldige EXIF-gegevens bevatten.",
    },

    // Recent uploads
    recentUploads: {
      cardTitle: "Recente uploads",
      cardSubtitle:
        "Bestanden geüpload in de afgelopen 24 uur. Selecteer bestanden om ze te verwijderen.",
      selectAll: "Alles selecteren",
      deselectAll: "Selectie opheffen",
      selectedSummary: (sel: number, total: number, size: string) =>
        `${sel} van ${total} geselecteerd (${size})`,
      deleteSelected: (n: number) => `${n} verwijderen`,
      deleting: "Verwijderen…",
      loading: "Uploads laden…",
      totalLabel: "Totaal:",
      last24h: "Geüpload in de afgelopen 24 uur",
      justNow: "Zojuist",
      minutesAgo: (m: number) => `${m} min geleden`,
      hoursAgo: (h: number) => `${h} uur geleden`,
      deleteTooltip: "Dit bestand verwijderen",
      dialogTitle: "Weet u het zeker?",
      dialogDescSingle: (name: string) =>
        `U staat op het punt "${name}" definitief te verwijderen. Dit kan niet ongedaan worden gemaakt.`,
      dialogDescBatch: (n: number) =>
        `U staat op het punt ${n} ${
          n === 1 ? "bestand" : "bestanden"
        } definitief te verwijderen. Dit kan niet ongedaan worden gemaakt.`,
      dialogCancel: "Annuleren",
      dialogConfirm: "Verwijderen",
      successDeletedSingle: (name: string) => `"${name}" verwijderd`,
      successDeletedBatch: (n: number, skipped: number) => {
        let msg = `${n} ${n === 1 ? "bestand" : "bestanden"} verwijderd`;
        if (skipped > 0) msg += ` (${skipped} overgeslagen — ouder dan 24 uur)`;
        return msg;
      },
    },

    // Mapbox map panel
    map: {
      panelTitle: "Actieve lagen",
      drawOrder: "Laagvolgorde",
      showAll: "Alles tonen",
      hideAll: "Alles verbergen",
      noLayers: "Geen lagen beschikbaar voor deze baan.",
      loadingMap: "Kaart laden",
      loadingMapDesc: "Baangegevens ophalen…",
      mapNotAvailable: "Kaart niet beschikbaar",
      mapNotAvailableDesc: "Geen kaartgegevens gevonden voor deze golfbaan",
      layersBtn: "Lagen",
      zoomIn: "Inzoomen",
      zoomOut: "Uitzoomen",
      showLabels: "Labels weergeven",
      hideLabels: "Labels verbergen",
      resetView: "Terug naar baanoverzicht",
      centerLocation: "Centreren op mijn locatie",
      enterFullscreen: "Volledig scherm",
      exitFullscreen: "Volledig scherm sluiten",
      compareMaps: "Kaarten vergelijken",
      exitCompare: "Vergelijking sluiten",
      baseImageryOpacity: "Dekking basisbeeldmateriaal",
      baseSatellite: "Basiskaart (satelliet)",
    },
  },
} as const;

export type Translations = typeof translations.en;

export const useT = (): Translations => {
  const { language } = useLanguage();
  return translations[language] as unknown as Translations;
};

export default translations;
