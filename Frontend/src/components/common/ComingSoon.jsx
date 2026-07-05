import { motion } from "framer-motion";
export function ComingSoon({ feature, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {" "}
      <div className="text-6xl mb-4">🔮</div>{" "}
      <span className="px-3 py-1 text-sm font-semibold bg-purple-100 text-purple-700 rounded-full mb-4">
        {" "}
        Coming Soon{" "}
      </span>{" "}
      <h3 className="text-xl font-semibold text-on-surface mb-2">
        {" "}
        {feature}{" "}
      </h3>{" "}
      <p className="text-on-surface-variant max-w-sm">
        {" "}
        {description ||
          "This feature is under development and will be available soon."}{" "}
      </p>{" "}
    </motion.div>
  );
}
