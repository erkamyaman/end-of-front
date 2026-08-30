/**
 * Memory management — memory lifecycle, garbage collection basics.
 *
 * Angular tie-in: the #1 real-world Angular memory leak — a component destroyed
 * without unsubscribing its Observables, so the subscription (and everything it
 * closes over) never gets garbage collected.
 */
