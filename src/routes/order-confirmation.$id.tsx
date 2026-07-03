import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useOrder, useSettings } from "@/lib/store";
import { OWNER_WHATSAPP } from "@/data/products";
import { CheckCircle2, Clock, Truck, ShieldCheck, XCircle, ArrowLeft, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/order-confirmation/$id")({
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { id } = Route.useParams();
  const { data: order, isLoading, error } = useOrder(id);
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.owner_whatsapp || OWNER_WHATSAPP;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neon border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <XCircle className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="mt-4 font-display text-2xl font-black">Order Not Found</h1>
          <p className="mt-2 text-muted-foreground">We couldn't retrieve the details for this order.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-gold">
            Go Home
          </Link>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Generate status timeline
  const getTimelineSteps = () => {
    const history = order.status_history || [];
    
    // Fallback if status_history is empty
    const resolvedHistory = history.length > 0 
      ? history 
      : [{ status: order.status, timestamp: order.created_at }];

    const steps = [
      { status: "Pending", title: "Order Placed", desc: "We have received your order request", icon: Clock },
      { status: "Confirmed", title: "Order Confirmed", desc: "Your order has been verified and is being packed", icon: ShieldCheck },
      { status: "Delivered", title: "Delivered", desc: "Your premium nutrition has been delivered", icon: Truck },
    ];

    if (order.status === "Cancelled") {
      // Find cancellation timestamp
      const cancelEntry = resolvedHistory.find(h => h.status === "Cancelled");
      return [
        { 
          status: "Cancelled", 
          title: "Order Cancelled", 
          desc: "This order has been cancelled", 
          icon: XCircle,
          timestamp: cancelEntry ? formatDate(cancelEntry.timestamp) : formatDate(order.created_at),
          completed: true,
          active: true
        }
      ];
    }

    return steps.map((step) => {
      const historyEntry = resolvedHistory.find((h) => h.status === step.status);
      const isCompleted = !!historyEntry;
      const isActive = order.status === step.status;

      return {
        ...step,
        timestamp: historyEntry ? formatDate(historyEntry.timestamp) : null,
        completed: isCompleted,
        active: isActive,
      };
    });
  };

  const timeline = getTimelineSteps();

  // Handle opening WhatsApp again if needed
  const openWhatsApp = () => {
    const lines = [
      `Hello, I want to check status of my order — *${order.order_no}*.`,
      "",
      `*Name:* ${order.customer_name}`,
      `*Total:* ₹${order.total.toLocaleString("en-IN")}`,
      `*Status:* ${order.status}`,
    ].join("\n");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Left Column: Thank you and Order Info */}
          <div className="md:col-span-3 space-y-6">
            <div className="rounded-2xl border border-border bg-gradient-card p-6 text-center md:text-left">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-neon/10 text-neon">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-black">Thank you for your order!</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Order ID: <span className="font-bold text-foreground">{order.order_no}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <h3 className="font-display text-lg font-bold mb-6">Order Status Timeline</h3>
              <div className="relative border-l border-border pl-6 ml-3 space-y-8">
                {timeline.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[35px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                        step.active 
                          ? "bg-neon border-transparent text-neon-foreground ring-4 ring-neon/20 shadow-neon" 
                          : step.completed 
                            ? "bg-muted border-border text-foreground" 
                            : "bg-surface border-border text-muted-foreground"
                      }`}>
                        <Icon className="h-3 w-3" />
                      </span>
                      
                      {/* Step content */}
                      <div>
                        <h4 className={`text-sm font-bold ${
                          step.active 
                            ? "text-neon" 
                            : step.completed 
                              ? "text-foreground" 
                              : "text-muted-foreground"
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                        {step.timestamp && (
                          <span className="inline-block mt-1 text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded font-mono">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <h3 className="font-display text-lg font-bold mb-4">Shipping Details</h3>
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block">Deliver To</span>
                  <span className="font-bold block mt-1">{order.customer_name}</span>
                  <span className="block mt-0.5">{order.phone}</span>
                  {order.alt_phone && <span className="block text-xs text-muted-foreground">Alt: {order.alt_phone}</span>}
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block">Address</span>
                  <span className="block mt-1">{order.address}</span>
                  {order.landmark && <span className="block text-xs text-muted-foreground">Landmark: {order.landmark}</span>}
                  <span className="block mt-0.5">{order.city}, {order.state || ""} - {order.pincode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <h3 className="font-display text-lg font-bold mb-4">Order Summary</h3>
              <ul className="divide-y divide-border">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-3 flex gap-3 first:pt-0 last:pb-0">
                    <img src={item.image_url} alt={item.name} className="h-14 w-14 rounded-lg object-cover bg-muted" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold truncate">{item.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{item.flavor} • {item.weight}</p>
                      <div className="flex justify-between items-center mt-1 text-xs">
                        <span className="text-muted-foreground">Qty: {item.quantity}</span>
                        <span className="font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-neon">
                    <span>Discount</span>
                    <span>- ₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
                </div>
                <div className="border-t border-border my-2 pt-2 flex justify-between font-display text-base font-bold">
                  <span>Grand Total</span>
                  <span className="text-gradient-gold">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* WhatsApp Support button */}
              <button 
                onClick={openWhatsApp}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-bold hover:bg-muted hover:border-neon/50 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Query on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
