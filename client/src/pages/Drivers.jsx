import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IoPeopleOutline, IoAddOutline, IoTrashOutline, IoCreateOutline } from "react-icons/io5";
import API from "../services/api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SkeletonLoader from "../components/SkeletonLoader";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import ConfirmDialog from "../components/ConfirmDialog";
import { exportToCSV } from "../utils/csvExport";
import { canCurrentUser } from "../utils/rolePermissions";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selected driver
  const [currentDriver, setCurrentDriver] = useState(null);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] = useState("HMV");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [phone, setPhone] = useState("");
  const [tripCompletion, setTripCompletion] = useState("");
  const [safetyScore, setSafetyScore] = useState("");
  const [status, setStatus] = useState("Available");

  // Filter state
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/drivers");
      if (response.data.success) {
        setDrivers(response.data.drivers);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch drivers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openAddModal = () => {
    setCurrentDriver(null);
    setName("");
    setLicenseNumber("");
    setLicenseCategory("HMV");
    setLicenseExpiry("");
    setPhone("");
    setTripCompletion("");
    setSafetyScore("");
    setStatus("Available");
    setIsFormOpen(true);
  };

  const openEditModal = (driver) => {
    setCurrentDriver(driver);
    setName(driver.name);
    setLicenseNumber(driver.licenseNumber);
    setLicenseCategory(driver.licenseCategory || "HMV");
    const formattedDate = driver.licenseExpiry ? new Date(driver.licenseExpiry).toISOString().split("T")[0] : "";
    setLicenseExpiry(formattedDate);
    setPhone(driver.phone || "");
    setTripCompletion(driver.tripCompletion || "");
    setSafetyScore(driver.safetyScore || "");
    setStatus(driver.status || "Available");
    setIsFormOpen(true);
  };

  const openDeleteModal = (driver) => {
    setDriverToDelete(driver);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name || !licenseNumber || !licenseCategory || !licenseExpiry || !phone || !tripCompletion || !safetyScore) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiry,
      phone,
      tripCompletion: Number(tripCompletion),
      safetyScore: Number(safetyScore),
      status,
    };

    const loadToast = toast.loading(currentDriver ? "Updating driver profile..." : "Adding new driver...");
    try {
      if (currentDriver) {
        const res = await API.put(`/drivers/${currentDriver._id}`, payload);
        if (res.data.success) {
          toast.success("Driver updated successfully", { id: loadToast });
          fetchDrivers();
          setIsFormOpen(false);
        }
      } else {
        const res = await API.post("/drivers", payload);
        if (res.data.success) {
          toast.success("Driver added successfully", { id: loadToast });
          fetchDrivers();
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
    if (!driverToDelete) return;

    const loadToast = toast.loading("Deleting driver...");
    try {
      const res = await API.delete(`/drivers/${driverToDelete._id}`);
      if (res.data.success) {
        toast.success("Driver deleted successfully", { id: loadToast });
        fetchDrivers();
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to delete driver";
      toast.error(msg, { id: loadToast });
    }
  };

  // CSV columns config
  const csvColumns = [
    { header: "Driver Name", key: "name" },
    { header: "Phone Number", key: "phone" },
    { header: "License Number", key: "licenseNumber" },
    { header: "Category", key: "licenseCategory" },
    {
      header: "License Expiry Date",
      key: "licenseExpiry",
      csvAccessor: (row) => row.licenseExpiry ? new Date(row.licenseExpiry).toLocaleDateString() : "",
    },
    { header: "Trip Completion Rate (%)", key: "tripCompletion" },
    { header: "Safety Score (out of 100)", key: "safetyScore" },
    { header: "Status", key: "status" },
  ];

  const handleExportCSV = () => {
    exportToCSV(filteredDrivers, csvColumns, "drivers");
  };

  // Define Table columns
  const columns = [
    {
      header: "Driver",
      key: "name",
      render: (row) => <span className="font-bold text-slate-100">{row.name}</span>,
    },
    { header: "Phone", key: "phone" },
    { header: "License", key: "licenseNumber" },
    { header: "Category", key: "licenseCategory" },
    {
      header: "Expiry",
      key: "licenseExpiry",
      render: (row) => new Date(row.licenseExpiry).toLocaleDateString(),
    },
    {
      header: "Trip Completion",
      key: "tripCompletion",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(row.tripCompletion || 0, 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-350">{row.tripCompletion}%</span>
        </div>
      ),
    },
    {
      header: "Safety Score",
      key: "safetyScore",
      render: (row) => {
        const score = row.safetyScore || 0;
        let color = "text-rose-400";
        if (score >= 90) color = "text-emerald-400";
        else if (score >= 75) color = "text-amber-400";
        return <span className={`font-bold ${color}`}>{score}/100</span>;
      },
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    ...(canCurrentUser("drivers", "edit") || canCurrentUser("drivers", "delete")
      ? [
          {
            header: "Actions",
            key: "actions",
            render: (row) => (
              <div className="flex items-center gap-2">
                {canCurrentUser("drivers", "edit") && (
                  <button
                    onClick={() => openEditModal(row)}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all cursor-pointer"
                    title="Edit Driver"
                  >
                    <IoCreateOutline className="text-base" />
                  </button>
                )}
                {canCurrentUser("drivers", "delete") && (
                  <button
                    onClick={() => openDeleteModal(row)}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                    title="Delete Driver"
                  >
                    <IoTrashOutline className="text-base" />
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  // Frontend Filter
  const filteredDrivers = drivers.filter((d) => {
    if (activeFilter === "All") return true;
    return d.status === activeFilter;
  });

  const filterTabs = [
    { label: "All", value: "All", count: drivers.length },
    { label: "Available", value: "Available", count: drivers.filter(d => d.status === "Available").length },
    { label: "On Trip", value: "On Trip", count: drivers.filter(d => d.status === "On Trip").length },
    { label: "Off Duty", value: "Off Duty", count: drivers.filter(d => d.status === "Off Duty").length },
    { label: "Suspended", value: "Suspended", count: drivers.filter(d => d.status === "Suspended").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <IoPeopleOutline className="text-emerald-500" />
            Drivers
          </h2>
          <p className="text-sm text-slate-400 mt-1">Manage driver records, licensing, and safety ratings</p>
        </div>
      </div>

      {/* Main Table view */}
      {isLoading ? (
        <SkeletonLoader type="table" columns={8} rows={5} />
      ) : (
        <Table
          columns={columns}
          data={filteredDrivers}
          searchPlaceholder="Search drivers..."
          emptyIcon="👨"
          emptyTitle="No Drivers Found"
          emptyMessage={activeFilter === "All" ? "Click Add Driver to register your first driver record" : `No drivers found with status "${activeFilter}"`}
          onExportCSV={handleExportCSV}
          filterBar={
            <FilterBar
              filters={filterTabs}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          }
          actions={
            canCurrentUser("drivers", "add") && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <IoAddOutline className="text-lg" />
                Add Driver
              </button>
            )
          }
        />
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentDriver ? "Edit Driver Details" : "Add New Driver"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Driver Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DL-982135"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                disabled={currentDriver !== null}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                License Category <span className="text-red-500">*</span>
              </label>
              <select
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="HMV">Heavy Motor Vehicle (HMV)</option>
                <option value="LMV">Light Motor Vehicle (LMV)</option>
                <option value="MCWG">Motorcycle with Gear (MCWG)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                License Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Driver Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Trip Completion Rate (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 96"
                value={tripCompletion}
                onChange={(e) => setTripCompletion(e.target.value)}
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Safety Score (out of 100) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 98"
                value={safetyScore}
                onChange={(e) => setSafetyScore(e.target.value)}
                min="0"
                max="100"
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
              {currentDriver ? "Save Changes" : "Add Driver"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Delete modal */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteSubmit}
        title="Delete Driver?"
        message={`Are you sure you want to permanently delete driver "${driverToDelete?.name}"? All driver dispatch history and safety scores will be archived.`}
        confirmLabel="Yes, Delete Driver"
      />
    </div>
  );
};

export default Drivers;
