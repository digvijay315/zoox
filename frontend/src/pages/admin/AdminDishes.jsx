import React, { useState, useEffect } from "react";
import api from "../../api";
import { PlusCircle, Utensils, Trash2, Image, ToggleLeft, ToggleRight, Sparkles, Loader2 } from "lucide-react";
import { showError, showConfirm } from "../../utils/alerts";

export default function AdminDishes() {
  const [dishes, setDishes] = useState([]);
  
  // Form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(""); // Stores Cloudinary URL after upload
  
  // Custom states requested by user
  const [loading, setloading] = useState(""); // Tracks field being uploaded/loaded
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [categories, setCategories] = useState([]);
  
  // Recipe related states
  const [inventoryItems, setInventoryItems] = useState([]);
  const [recipe, setRecipe] = useState([]); // Array of { item: "", quantity: "", unit: "kg" }

  useEffect(() => {
    fetchDishes();
    fetchCategories();
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const res = await api.get("/api/inventory/items?limit=1000");
      if (res.data.success) {
        setInventoryItems(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/lookups?limit=1000");
      if (res.data.success) {
        setCategories(res.data.data.filter(l => l.type === "DISH_CATEGORY" && l.isActive));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDishes = async () => {
    try {
      const res = await api.get("api/dishes");
      if (res.data.success) {
        setDishes(res.data.dishes);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  // 🧩 Common upload handler (exactly aligned with User's code snippet)
  const handleFileChange = async (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setloading(fieldName);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await api.post("api/upload/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success && res.data.urls && res.data.urls.length > 0) {
        // Save the first URL as the dish image
        setImage(res.data.urls[0]);
        setMsg({ text: "Image uploaded successfully to Cloudinary!", type: "success" });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Upload Failed", "Image upload failed. Please try again.");
      setMsg({ text: "Image upload failed. Please try again.", type: "error" });
    } finally {
      setloading("");
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!image) {
      showError("Image Required", "Please upload a dish image first.");
      return;
    }
    if (!category) {
      showError("Category Required", "Please select a category.");
      return;
    }

    setFormSubmitLoading(true);
    setMsg({ text: "", type: "" });

    try {
      // Filter out any recipe items that have no item selected or quantity <= 0
      const validRecipe = recipe.filter(r => r.item && Number(r.quantity) > 0).map(r => ({
        item: r.item,
        quantity: Number(r.quantity),
        unit: r.unit
      }));

      const res = await api.post("api/dishes", {
        name,
        price: Number(price),
        category,
        image,
        recipe: validRecipe,
      });

      if (res.data.success) {
        setMsg({ text: "Dish added successfully to menu!", type: "success" });
        // Clear fields
        setName("");
        setPrice("");
        setCategory("");
        setImage("");
        setRecipe([]);
        
        // Refresh list
        fetchDishes();
      }
    } catch (error) {
      console.error("Failed to add dish:", error);
      setMsg({
        text: error.response?.data?.message || "Failed to add dish.",
        type: "error",
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const addRecipeRow = () => {
    setRecipe([...recipe, { item: "", quantity: "", unit: "kg" }]);
  };

  const removeRecipeRow = (index) => {
    const newRecipe = [...recipe];
    newRecipe.splice(index, 1);
    setRecipe(newRecipe);
  };

  const updateRecipeRow = (index, field, value) => {
    const newRecipe = [...recipe];
    newRecipe[index][field] = value;
    
    // Auto-fill unit if item is selected
    if (field === 'item' && value) {
      const selectedItem = inventoryItems.find(i => i._id === value);
      if (selectedItem && selectedItem.unit) {
        newRecipe[index].unit = selectedItem.unit;
      }
    }
    
    setRecipe(newRecipe);
  };

  const handleToggleAvailability = async (dish) => {
    try {
      const res = await api.put(`api/dishes/${dish._id}`, {
        available: !dish.available,
      });

      if (res.data.success) {
        fetchDishes();
      }
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  };

  const handleDeleteDish = async (id) => {
    const result = await showConfirm(
      "Are you sure?",
      "You want to delete this dish from the menu?",
      "Yes, Delete!"
    );
    if (!result.isConfirmed) return;

    try {
      const res = await api.delete(`api/dishes/${id}`);
      if (res.data.success) {
        fetchDishes();
      }
    } catch (error) {
      console.error("Failed to delete dish:", error);
      showError("Failed", error.response?.data?.message || "Failed to delete dish");
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60";
  };

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 overflow-x-hidden no-print">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-3">
            <Utensils className="w-8 h-8" />
            Dishes Management
          </h1>
          <p className="text-slate-400 mt-1">Manage your restaurant menu items</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT: DISHES LIST */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {dishes.length > 0 ? (
              dishes.map((dish) => (
                <div
                  key={dish._id}
                  className={`glass-card rounded-xl overflow-hidden border transition-all ${
                    dish.available ? "border-gold-800/15" : "border-red-950/40 opacity-70"
                  }`}
                >
                  <div className="h-28 w-full bg-slate-850 relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                    <span className="absolute bottom-2 right-2 bg-slate-950/85 text-amber-500 border border-amber-500/25 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                      ₹{dish.price}
                    </span>
                  </div>

                  <div className="p-3.5 flex flex-col gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-150 truncate">{dish.name}</h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{dish.category}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 mt-1">
                      <button
                        onClick={() => handleToggleAvailability(dish)}
                        className={`flex items-center gap-1 text-[10px] font-bold ${
                          dish.available ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {dish.available ? (
                          <>
                            <ToggleRight className="w-4 h-4" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteDish(dish._id)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition-all"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 text-center gap-2">
                <Utensils className="w-10 h-10 text-slate-650" />
                <p className="text-xs">No dishes added to menu yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: ADD DISH FORM */}
      <div className="w-full xl:w-80 shrink-0">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-800 pb-3">
            <PlusCircle className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-sm text-slate-200">Add Menu Item</h2>
          </div>

          {msg.text && (
            <div className={`p-4 rounded-xl mb-4 text-xs border ${
              msg.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleAddDish} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Dish/Item Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Veg Thali, Paneer Kadhai..."
                className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Price (INR)
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="₹ Amount"
                className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Menu Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500/60"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Cloudinary Image Upload Area */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Upload Dish Image
              </label>
              <div className="bg-slate-900/60 border border-dashed border-slate-800 hover:border-amber-500/40 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative min-h-[120px]">
                {loading === "dishImage" ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    <p className="text-[10px] text-slate-400 font-medium">Uploading to Cloudinary...</p>
                  </div>
                ) : image ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-700" />
                    <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Ready to save</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <Image className="w-6 h-6 stroke-[1.5]" />
                    <p className="text-[10px]">Select image file</p>
                    <p className="text-[8px] text-slate-600">JPG, PNG up to 5MB</p>
                  </div>
                )}
                
                {/* File input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "dishImage")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={loading === "dishImage"}
                />
              </div>
            </div>

            {/* Recipe Configuration */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Recipe (Optional)
                </label>
                <button
                  type="button"
                  onClick={addRecipeRow}
                  className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1 font-bold"
                >
                  <PlusCircle className="w-3 h-3" /> Add Item
                </button>
              </div>
              
              {recipe.map((r, index) => (
                <div key={index} className="flex gap-2 mb-2 items-start">
                  <div className="flex-1">
                    <select
                      value={r.item}
                      onChange={(e) => updateRecipeRow(index, 'item', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-amber-500/60"
                    >
                      <option value="">Select Inventory Item</option>
                      {inventoryItems.map(inv => (
                        <option key={inv._id} value={inv._id}>{inv.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={r.quantity}
                      onChange={(e) => updateRecipeRow(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div className="w-12">
                    <input
                      type="text"
                      value={r.unit}
                      readOnly
                      className="w-full bg-slate-800 border border-slate-800 text-slate-400 rounded-lg px-2 py-1.5 text-xs outline-none text-center cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRecipeRow(index)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {recipe.length === 0 && (
                <p className="text-[10px] text-slate-500 text-center py-2 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
                  No recipe items added.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={formSubmitLoading || !image}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-600/15 active:scale-[0.98] transition-all flex items-center justify-center text-xs disabled:opacity-50"
            >
              {formSubmitLoading ? "Saving..." : "Add to Catalog"}
            </button>
          </form>
        </div>
      </div>

    </div>
    </div>
  );
}
