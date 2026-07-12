import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IoNavigateOutline, IoAddOutline, IoTrashOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import API from "../services/api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selections
  const [tripToDelete, setTripToDelete] = useState(null);

  // Form Fields State
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [plannedDistance, setPlannedDistance] = useState("");

  // Get user role for RBAC
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isDispatcher = user.role === "Dispatcher";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        API.get("/trips"),
        API.get("/vehicles"),
        API.get("/drivers"),
      ]);

      if (tripsRes.data.success) setTrips(tripsRes.data.trips);
      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.vehicles);
      if (driversRes.data.success) setDrivers(driversRes.data.drivers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load transport details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter lists to only show "Available" status vehicles & drivers
  const availableVehicles = vehicles.filter((v) => v.status === "Available");
  const availableDrivers = drivers.filter(
    (d) => d.status === "Available" && new Date(d.licenseExpiry) > new Date()
  );

  const openAddModal = () => {
    setSelectedVehicle("");
    setSelectedDriver("");
    setSource("");
    setDestination("");
    setCargoWeight("");
    setPlannedDistance("");
    setIsFormOpen(true);
  };

  const openDeleteModal = (trip) => {
    setTripToDelete(trip);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVehicle || !selectedDriver || !source || !destination || !cargoWeight || !plannedDistance) {
      return toast.error("Please fill all required fields");
    }

    // Capacity client check
    const vehicleObj = vehicles.find((v) => v._id === selectedVehicle);
    if (vehicleObj && Number(cargoWeight) > vehicleObj.capacity) {
      return toast.error(`Cargo weight exceeds vehicle capacity of ${vehicleObj.capacity} kg`);
    }

    const payload = {
      vehicle: selectedVehicle,
      driver: selectedDriver,
      source,
      destination,
      cargoWeight: Number(cargoWeight),
      plannedDistance: Number(plannedDistance),
    };

    const loadToast = toast.loading("Dispatching new trip...");
    try {
      const res = await API.post("/trips", payload);
      if (res.data.success) {
        toast.success("Trip dispatched successfully", { id: loadToast });
        fetchData();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to dispatch trip";
      toast.error(msg, { id: loadToast });
    }
  };

  const handleCompleteTrip = async (tripId) => {
    const loadToast = toast.loading("Marking trip as completed...");
    try {
      const res = await API.put(`/trips/${tripId}/complete`);
      if (res.data.success) {
        toast.success("Trip completed successfully", { id: loadToast });
        fetchData();
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to complete trip";
      toast.error(msg, { id: loadToast });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!tripToDelete) return;

    const loadToast = toast.loading("Deleting trip record...");
    try {
      const res = await API.delete(`/trips/${tripToDelete._id}`);
      if (res.data.success) {
        toast.success("Trip record deleted successfully", { id: loadToast });
        fetchData();
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to delete trip";
      toast.error(msg, { id: loadToast });
    }
  };

  // Define Table columns
  const columns = [
    {
      header: "Vehicle",
      key: "vehicle",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-100">
            {row.vehicle?.registrationNumber || "N/A"}
          </div>
          <div className="text-[10px] text-slate-500">{row.vehicle?.model || "-"}</div>
        </div>
      ),
    },
    {
      header: "Driver",
      key: "driver",
      render: (row) => (
        <div>
          <div className="text-slate-100 font-semibold">{row.driver?.name || "N/A"}</div>
          <div className="text-[10px] text-slate-500">{row.driver?.phone || "-"}</div>
        </div>
      ),
    },
    {
      header: "Route",
      key: "route",
      render: (row) => (
        <div>
          <div className="text-slate-200">
            {row.source} → {row.destination}
          </div>
          <div className="text-[10px] text-slate-500">{row.plannedDistance} km</div>
        </div>
      ),
    },
    {
      header: "Cargo",
      key: "cargoWeight",
      render: (row) => `${row.cargoWeight?.toLocaleString()} kg`,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => {
        const colors = {
          Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
        return (
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              colors[row.status] || colors.Dispatched
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Dispatch Time",
      key: "dispatchTime",
      render: (row) =>
        row.dispatchTime ? new Date(row.dispatchTime).toLocaleString() : "-",
    },
    ...(isDispatcher
      ? [
          {
            header: "Actions",
            key: "actions",
            render: (row) => (
              <div className="flex items-center gap-2">
                {row.status === "Dispatched" && (
                  <button
                    onClick={() => handleCompleteTrip(row._id)}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all cursor-pointer"
                    title="Complete Trip"
                  >
                    <IoCheckmarkCircleOutline className="text-base" />
                  </button>
                )}
                <button
                  onClick={() => openDeleteModal(row)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                  title="Delete Trip"
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
            <IoNavigateOutline className="text-indigo-500" />
            Trips
          </h2>
          <p className="text-sm text-slate-400 mt-1">Dispatch and complete freight routing trips</p>
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
          data={trips}
          searchPlaceholder="Search trips by route, vehicle, driver or status..."
          actions={
            isDispatcher && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-750 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/25 cursor-pointer"
              >
                <IoAddOutline className="text-lg" />
                Dispatch Trip
              </button>
            )
          }
        />
      )}

      {/* Dispatch Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Dispatch New Trip"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Available Vehicle <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="">-- Select Available Vehicle --</option>
              {availableVehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.registrationNumber} ({v.model} - Max Cap: {v.capacity} kg)
                </option>
              ))}
            </select>
            {availableVehicles.length === 0 && !isLoading && (
              <p className="text-[11px] text-amber-500 mt-1">No vehicles are currently Available.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Available Driver <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="">-- Select Available Driver --</option>
              {availableDrivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} (License: {d.licenseCategory} | Rating: {d.safetyScore}/100)
                </option>
              ))}
            </select>
            {availableDrivers.length === 0 && !isLoading && (
              <p className="text-[11px] text-amber-500 mt-1">No drivers are currently Available.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Source Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Berhampur"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Destination Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Bhubaneswar"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Cargo Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 450"
                value={cargoWeight}
                onChange={(e) => setCargoWeight(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Planned Distance (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 170"
                value={plannedDistance}
                onChange={(e) => setPlannedDistance(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
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
              Dispatch Route
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Trip Deletion"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            Are you sure you want to permanently delete the trip record from{" "}
            <span className="font-bold text-slate-105">{tripToDelete?.source}</span> to{" "}
            <span className="font-bold text-slate-105">{tripToDelete?.destination}</span>?
            This will remove the log history.
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
              Yes, Delete Trip
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trips;
