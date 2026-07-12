import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IoBuildOutline, IoAddOutline, IoTrashOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import API from "../services/api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selection state
  const [maintenanceToDelete, setMaintenanceToDelete] = useState(null);

  // Form Fields State
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");

  // Get current logged-in user to verify FleetManager role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isFleetManager = user.role === "FleetManager";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // NOTE: backend API route is registered as '/maintanance'
      const [maintRes, vehiclesRes] = await Promise.all([
        API.get("/maintanance"),
        API.get("/vehicles"),
      ]);

      if (maintRes.data.success) {
        setMaintenances(maintRes.data.maintenances);
      }
      if (vehiclesRes.data.success) {
        setVehicles(vehiclesRes.data.vehicles);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load maintenance records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter available vehicles to log maintenance
  const availableVehicles = vehicles.filter((v) => v.status === "Available");

  const openAddModal = () => {
    setSelectedVehicle("");
    setIssue("");
    setDescription("");
    setCost("");
    setIsFormOpen(true);
  };

  const openDeleteModal = (item) => {
    setMaintenanceToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVehicle || !issue || !description || !cost) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      vehicle: selectedVehicle,
      issue,
      description,
      cost: Number(cost),
    };

    const loadToast = toast.loading("Adding maintenance record...");
    try {
      const res = await API.post("/maintanance", payload);
      if (res.data.success) {
        toast.success("Maintenance logged successfully", { id: loadToast });
        fetchData();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to add maintenance record";
      toast.error(msg, { id: loadToast });
    }
  };

  const handleCompleteMaintenance = async (maintId) => {
    const loadToast = toast.loading("Completing maintenance record...");
    try {
      const res = await API.put(`/maintanance/${maintId}/complete`);
      if (res.data.success) {
        toast.success("Maintenance completed successfully", { id: loadToast });
        fetchData();
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to complete maintenance";
      toast.error(msg, { id: loadToast });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!maintenanceToDelete) return;

    const loadToast = toast.loading("Deleting maintenance record...");
    try {
      const res = await API.delete(`/maintanance/${maintenanceToDelete._id}`);
      if (res.data.success) {
        toast.success("Record deleted successfully", { id: loadToast });
        fetchData();
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to delete record";
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
      header: "Issue",
      key: "issue",
      render: (row) => <span className="font-semibold text-slate-200">{row.issue}</span>,
    },
    {
      header: "Description",
      key: "description",
      render: (row) => <span className="text-slate-400 line-clamp-1">{row.description}</span>,
    },
    {
      header: "Cost",
      key: "cost",
      render: (row) => `₹${row.cost?.toLocaleString()}`,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => {
        const colors = {
          Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
        return (
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              colors[row.status] || colors.Pending
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Logged Date",
      key: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    ...(isFleetManager
      ? [
          {
            header: "Actions",
            key: "actions",
            render: (row) => (
              <div className="flex items-center gap-2">
                {row.status === "Pending" && (
                  <button
                    onClick={() => handleCompleteMaintenance(row._id)}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all cursor-pointer"
                    title="Complete Service"
                  >
                    <IoCheckmarkCircleOutline className="text-base" />
                  </button>
                )}
                <button
                  onClick={() => openDeleteModal(row)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                  title="Delete Record"
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
            <IoBuildOutline className="text-amber-500" />
            Maintenance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Log mechanical repairs and schedule periodic maintenance
          </p>
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
          data={maintenances}
          searchPlaceholder="Search maintenance entries by vehicle registration, issue or description..."
          actions={
            isFleetManager && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-750 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/25 cursor-pointer"
              >
                <IoAddOutline className="text-lg" />
                Create Maintenance
              </button>
            )
          }
        />
      )}

      {/* Add Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Create Maintenance Log"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Vehicle to Maintain <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="">-- Select Available Vehicle --</option>
              {availableVehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.registrationNumber} ({v.model})
                </option>
              ))}
            </select>
            {availableVehicles.length === 0 && !isLoading && (
              <p className="text-[11px] text-amber-500 mt-1">
                No vehicles are currently Available for maintenance.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Issue Category / Service Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Brake Service, Engine Oil Change"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Problem Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="e.g. Brake Pads Worn, squeaking noise on deceleration"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Estimated Cost (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 7800"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
            />
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
              Log Maintenance
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Maintenance Delete"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            Are you sure you want to permanently delete the maintenance log for{" "}
            <span className="font-bold text-slate-105">
              {maintenanceToDelete?.vehicle?.registrationNumber || "this vehicle"}
            </span>{" "}
            ({maintenanceToDelete?.issue})? This action cannot be undone.
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
              Yes, Delete Record
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Maintenance;
