import { motion, type HTMLMotionProps } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };

export function Reveal(props: HTMLMotionProps<"div">) {
  return <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={item} {...props} />;
}

export function Stagger(props: HTMLMotionProps<"div">) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }} {...props} />
  );
}

export function StaggerItem(props: HTMLMotionProps<"div">) {
  return <motion.div variants={item} {...props} />;
}
