import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants } from '../../motion/variants'
import { Page } from '../../types'

interface PageShellProps {
  page: Page
  children: React.ReactNode
}

export function PageShell({ page, children }: PageShellProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        variants={pageVariants}
        initial="hidden"
        animate="visible"    
        exit="exit"
        style={{ height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
