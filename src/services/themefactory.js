export default class ThemeFactoryClass {

    themes;

    constructor() {
        this.themes= [
            {
              name: "CRM Together",
               light: {
                      primary: '#662d90',
                      secondary: '#33a8a5',
                      displayheader: '#EBEDEF',
                      accent: '#2e3132',
                      error: '#FF5252',
                      info: '#F3F4F6',
                      success: '#4CAF50',
                      warning: '#FFC107',
                  },
                  dark: {
                    primary: '#662d90',
                    secondary: '#33a8a5',
                    displayheader: '#7e7e7e',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                 },
            },
            {
              name: "Sage",
              light: {
                primary: "#36C62E",
                secondary: "#3C434D",
                displayheader: '#EBEDEF',          
                accent: "#2e3132",
                success: "#6dff74",
                info: "#7365ff",
                warning: "#2e8ac0",
                error: "#ff5e3c"
              },dark: {
                primary: "#36C62E",
                accent: "#7CB342",
                secondary: "#3C434D",
                displayheader: '#EBEDEF',
                success: "#4CAF50",
                info: "#6156d8",
                warning: "#1565C0",
                error: "#FF7043"
              }
            },
            {
              name: "Outlook",
              light: {
                primary: "#1560A0",
                secondary: "#106EBE",
                displayheader: '#F3F2F1',          
                accent: "#2e3132",
                success: "#ffea70",
                info: "#229eff",
                warning: "#e239ff",
                error: "#e82424"
              },        
              dark: {
                primary: "#33691E",
                accent: "#00000",
                secondary: "#607D8B",
                displayheader: '#7e7e7e',          
                success: "#FFEB3B",
                info: "#2196F3",
                warning: "#9C27B0",
                error: "#B71C1C"
              }
            },
            {
              name: "Neutral",
                light: {
                  primary: "#000000",
                  secondary: "#3C434D",
                  displayheader: '#F3F2F1',          
                  accent: "#2e3132",
                  success: "#ffea70",
                  info: "#229eff",
                  warning: "#e239ff",
                  error: "#e82424"
                },        
                dark: {
                  primary: "#00000",
                  accent: "#00000",
                  secondary: "#607D8B",
                  displayheader: '#7e7e7e',          
                  success: "#FFEB3B",
                  info: "#2196F3",
                  warning: "#9C27B0",
                  error: "#B71C1C"
                }
              },
              {
                name: "Red",
                  light: {
                    primary: "#CD0000",
                    secondary: "#EE6363",
                    displayheader: '#F3F2F1',          
                    accent: "#2e3132",
                    success: "#ffea70",
                    info: "#229eff",
                    warning: "#e239ff",
                    error: "#e82424"
                  },        
                  dark: {
                    primary: "#00000",
                    accent: "#00000",
                    secondary: "#607D8B",
                    displayheader: '#7e7e7e',          
                    success: "#FFEB3B",
                    info: "#2196F3",
                    warning: "#9C27B0",
                    error: "#B71C1C"
                  }
                }
          ]
    }

}