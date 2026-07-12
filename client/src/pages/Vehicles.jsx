import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IoCarOutline, IoAddOutline, IoTrashOutline, IoCreateOutline } from "react-icons/io5";
import API from "../services/api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Selected / Editing vehicle
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Form Fields State
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("Truck");
  const [capacity, setCapacity] = useState("");
  const [odometer, setOdometer] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("");
  const [status, setStatus] = useState("Available");

  // Get current logged-in user to verify FleetManager role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isFleetManager = user.role === "FleetManager";

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/vehicles");
      if (response.data.success) {
        setVehicles(response.data.vehicles);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAddModal = () => {
    setCurrentVehicle(null);
    setRegistrationNumber("");
    setModel("");
    setType("Truck");
    setCapacity("");
    setOdometer("");
    setAcquisitionCost("");
    setStatus("Available");
    setIsFormOpen(true);
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setRegistrationNumber(vehicle.registrationNumber);
    setModel(vehicle.model);
    setType(vehicle.type);
    setCapacity(vehicle.capacity);
    setOdometer(vehicle.odometer);
    setAcquisitionCost(vehicle.acquisitionCost);
    setStatus(vehicle.status);
    setIsFormOpen(true);
  };

  const openDeleteModal = (vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!registrationNumber || !model || !type || !capacity || !odometer || !acquisitionCost) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      registrationNumber,
      model,
      type,
      capacity: Number(capacity),
      odometer: Number(odometer),
      acquisitionCost: Number(acquisitionCost),
      status,
    };

    const loadToast = toast.loading(currentVehicle ? "Updating vehicle..." : "Adding vehicle...");
    try {
      if (currentVehicle) {
        // Update
        const res = await API.put(`/vehicles/${currentVehicle._id}`, payload);
        if (res.data.success) {
          toast.success("Vehicle updated successfully", { id: loadToast });
          fetchVehicles();
          setIsFormOpen(false);
        }
      } else {
        // Create
        const res = await API.post("/vehicles", payload);
        if (res.data.success) {
          toast.success("Vehicle added successfully", { id: loadToast });
          fetchVehicles();
          setIsFormOpen(false);
        }
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Operation failed";
      toast.error(msg, { id: loadToast });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!vehicleToDelete) return;

    const loadToast = toast.loading("Deleting vehicle...");
    try {
      const res = await API.delete(`/vehicles/${vehicleToDelete._id}`);
      if (res.data.success) {
        toast.success("Vehicle deleted successfully", { id: loadToast });
        fetchVehicles();
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to delete vehicle";
      toast.error(msg, { id: loadToast });
    }
  };

  // Define Table columns
  const columns = [
    {
      header: "Registration",
      key: "registrationNumber",
      render: (row) => <span className="font-bold text-slate-100">{row.registrationNumber}</span>,
    },
    { header: "Model", key: "model" },
    { header: "Type", key: "type" },
    {
      header: "Capacity",
      key: "capacity",
      render: (row) => `${row.capacity?.toLocaleString()} kg`,
    },
    {
      header: "Odometer",
      key: "odometer",
      render: (row) => `${row.odometer?.toLocaleString()} km`,
    },
    {
      header: "Cost",
      key: "acquisitionCost",
      render: (row) => `₹${row.acquisitionCost?.toLocaleString()}`,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => {
        const colors = {
          Available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          "On Trip": "bg-blue-500/10 text-blue-400 border-blue-500/20",
          "In Shop": "bg-amber-500/10 text-amber-400 border-amber-500/20",
          Retired: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        };
        return (
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              colors[row.status] || colors.Available
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    ...(isFleetManager
      ? [
          {
            header: "Actions",
            key: "actions",
            render: (row) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(row)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all cursor-pointer"
                  title="Edit Vehicle"
                >
                  <IoCreateOutline className="text-base" />
                </button>
                <button
                  onClick={() => openDeleteModal(row)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                  title="Delete Vehicle"
                >
                  <IoTrashOutline className="text-base" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <IoCarOutline className="text-indigo-500" />
            Vehicles
          </h2>
          <p className="text-sm text-slate-400 mt-1">Manage and track your active transport vehicles</p>
        </div>
      </div>

      {/* Main Table view */}
      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={vehicles}
          searchPlaceholder="Search vehicles by registration, model or type..."
          actions={
            isFleetManager && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-750 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/25 cursor-pointer"
              >
                <IoAddOutline className="text-lg" />
                Add Vehicle
              </button>
            )
          }
        />
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentVehicle ? "Edit Vehicle Details" : "Add New Vehicle"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. OD07AB4521"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                disabled={currentVehicle !== null} // Lock registration edit if editing
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. TRUCK-11"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="SUV">SUV</option>
                <option value="Car">Car</option>
                <option value="Trailer">Trailer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Capacity (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Odometer (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Acquisition Cost (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 2400000"
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Vehicle Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              {currentVehicle ? "Save Changes" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Vehicle Deletion"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            Are you sure you want to permanently delete the vehicle{" "}
            <span className="font-bold text-slate-100">
              {vehicleToDelete?.registrationNumber}
            </span>{" "}
            ({vehicleToDelete?.model}) from the ERP system? This action is irreversible.
          </p>
          <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 border border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteSubmit}
              className="px-4 py-2 bg-red-650 hover:bg-red-550 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              Yes, Delete Vehicle
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Vehicles;
