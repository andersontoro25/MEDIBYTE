/**
 * DevExtreme (viz/core/themes/generic.greenmist.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,
    ACCENT_COLOR = "#3cbab2",
    BACKGROUND_COLOR = "#f5f5f5",
    TITLE_COLOR = "#28484f",
    SUBTITLE_COLOR = "#7eb2be",
    TEXT_COLOR = "#657c80",
    BORDER_COLOR = "#dedede";
registerTheme({
    name: "generic.greenmist",
    defaultPalette: "Green Mist",
    backgroundColor: BACKGROUND_COLOR,
    primaryTitleColor: TITLE_COLOR,
    secondaryTitleColor: SUBTITLE_COLOR,
    gridColor: BORDER_COLOR,
    axisColor: TEXT_COLOR,
    "export": {
        backgroundColor: BACKGROUND_COLOR,
        font: {
            color: TITLE_COLOR
        },
        button: {
            "default": {
                color: TITLE_COLOR,
                borderColor: "#a2b4b8",
                backgroundColor: BACKGROUND_COLOR
            },
            hover: {
                color: TITLE_COLOR,
                borderColor: "#7f989e",
                backgroundColor: "rgba(222, 222, 222, 0.4)"
            },
            focus: {
                color: TITLE_COLOR,
                borderColor: "#5f777c",
                backgroundColor: "rgba(222, 222, 222, 0.4)"
            },
            active: {
                color: TITLE_COLOR,
                borderColor: "#5f777c",
                backgroundColor: "rgba(222, 222, 222, 0.8)"
            }
        }
    },
    legend: {
        font: {
            color: TEXT_COLOR
        }
    },
    tooltip: {
        color: "#fff",
        border: {
            color: BORDER_COLOR
        },
        font: {
            color: TITLE_COLOR
        }
    },
    "chart:common": {
        commonSeriesSettings: {
            label: {
                border: {
                    color: BORDER_COLOR
                }
            }
        }
    },
    chart: {
        commonPaneSettings: {
            border: {
                color: BORDER_COLOR
            }
        },
        commonAxisSettings: {
            breakStyle: {
                color: "#c1c1c1"
            }
        },
        commonAnnotationSettings: {
            color: "#fff",
            border: {
                color: BORDER_COLOR
            },
            font: {
                color: TITLE_COLOR
            }
        }
    },
    funnel: {
        item: {
            border: {
                color: BACKGROUND_COLOR
            }
        }
    },
    sparkline: {
        pointColor: BACKGROUND_COLOR,
        minColor: "#ffc852",
        maxColor: "#f74a5e"
    },
    treeMap: {
        group: {
            color: BORDER_COLOR,
            label: {
                font: {
                    color: SUBTITLE_COLOR
                }
            }
        }
    },
    rangeSelector: {
        shutter: {
            color: BACKGROUND_COLOR
        },
        scale: {
            breakStyle: {
                color: "#c1c1c1"
            },
            tick: {
                opacity: .12
            }
        },
        selectedRangeColor: ACCENT_COLOR,
        sliderMarker: {
            color: ACCENT_COLOR
        },
        sliderHandle: {
            color: ACCENT_COLOR,
            opacity: .5
        }
    },
    bullet: {
        color: ACCENT_COLOR
    },
    gauge: {
        valueIndicators: {
            rangebar: {
                color: ACCENT_COLOR
            },
            textcloud: {
                color: ACCENT_COLOR
            }
        }
    }
}, "generic.light");
