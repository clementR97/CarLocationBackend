// Dashboard Carrent
exports.getDashboardStats = async (req, res) => {
    try {
      const stats = {
        totalVehicules: 25,
        totalReservations: 150,
        totalClients: 75,
        revenus: 12500
      };
  
      res.json({
        success: true,
        data: stats,
        message: 'Dashboard Carrent'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Gestion véhicules
  exports.getVehicles = async (req, res) => {
    try {
      res.json({
        success: true,
        message: "Liste des véhicules Carrent",
        data: [] // À connecter avec ta vraie DB
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };