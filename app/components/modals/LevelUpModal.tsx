import { Modal } from "antd";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import Button from "../shared/Button";

interface LevelUpModalProps {
  visible: boolean;
  newLevel: number | null;
  xpGained: number | null;
  onConfirm: () => void;
}

export const LevelUpModal = ({
  visible,
  newLevel,
  xpGained,
  onConfirm,
}: LevelUpModalProps) => {
  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      width={420}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2.5rem 1.5rem",
          background:
            "linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        },
      }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 12 }}
        className="text-white"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              transition: { duration: 1.2, repeat: Infinity },
            }}
          >
            <FontAwesomeIcon
              icon={faTrophy}
              size="4x"
              className="w-20 h-20 text-yellow-400 drop-shadow-xl"
            />
          </motion.div>
        </div>

        <h1 className="text-3xl font-extrabold mb-2 tracking-wide drop-shadow-sm">
          Level Up!
        </h1>

        <p className="text-lg font-medium mb-1">
          Selamat! Kamu telah mencapai{" "}
          <span className="text-yellow-300 font-semibold">Lv. {newLevel}</span>{" "}
          🎉
        </p>

        <motion.p
          className="text-sm text-blue-100 mb-6 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          XP kamu meningkat sebesar{" "}
          <span className="font-bold">+{xpGained}</span> ✨
        </motion.p>

        <Button
          variant="outline"
          onClick={onConfirm}
          className="mx-auto bg-white/20 hover:bg-white/30 text-white border-white rounded-full px-6"
        >
          Ok
        </Button>
      </motion.div>
    </Modal>
  );
};
